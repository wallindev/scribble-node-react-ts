import { join, resolve } from 'node:path'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { existsSync as fileExists } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { HttpStatusCode } from 'axios'
import { JSONFilePreset } from 'lowdb/node'
import { envFileVars, envConfigVars, IS_LIVE, NODE_ENV, RUN_ENV, PROD_ENV } from './config.js'
import { __dirname } from './constants.js'
import { comparePassword, env, generateToken, getMaxId, hashPassword, localDateStr, readToken, validateToken } from './functions.js'
// import './config.js'

// Directories and files
const BUILD_DIR = 'dist'
const buildPath = join(__dirname, '../', BUILD_DIR)
const indexHtmlPath = join(__dirname, '../', PROD_ENV ? BUILD_DIR : '', 'index.html')
console.log('\nbuildPath:', buildPath)
console.log('indexHtmlPath:', indexHtmlPath)
console.log("envConfigVars.DB_PATH:", envConfigVars.DB_PATH)
const dbFilePath = resolve('./api-data/db.json')
console.log('dbFilePath: ', dbFilePath)

// Express Server
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// API Router
const api = express.Router()
app.use('/api', api)

// Static files
app.use(express.static(buildPath))

// Read db to memory
const db = await JSONFilePreset(dbFilePath, { articles: [], users: [], tokens: [] })
// console.log('db: ', db)
// console.log('db.data: ', db.data)

// const apiRoot = '/api'
const onlyDigits = '([0-9]+)'

/*
 * Middlewares
 *
 */

// Authentication middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(HttpStatusCode.Unauthorized).json({ message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]

  try {
    const tokenData = readToken(token)
    console.log('Token Data:', tokenData)
    // TODO: Must change 'token' to token below!!
    // This is just a test of malforming the token!
    const decoded = await validateToken(token)
    const { userId, iat, exp } = decoded
    console.log('\nToken is valid:', decoded)
    console.log('\nToken data')
    console.log('------------')
    console.log('User id:', userId)
    console.log('Issued:', localDateStr(new Date(iat * 1000)))
    console.log('Expiry:', localDateStr(new Date(exp * 1000)))
    req.user = decoded
    next()
  } catch (error) {
    // console.log('error.name:', error.name)
    // console.log('error.message:', error.message)
    // console.log('error.stack:', error.stack)
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired:', error.message)
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Token verification failed:', error.message)
    } else {
      console.error('Unexpected JWT Error:', error.message)
    }
    return res.status(HttpStatusCode.Unauthorized).json({ error })
  }
}

/*
 * Default params and other request data
 *
 */

// Default article id param check
api.use(`/articles/:id${onlyDigits}`, authenticate, (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid Article Id' })
  next()
})

// Default user id param check
api.use([`/users/:id${onlyDigits}`/* , `/profile/:id${onlyDigits}` */], authenticate, (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid User Id' })
  next()
})

// User id on protected resources
api.use(['/articles'/* , '/profile' */], authenticate, (req, res, next) => {
  // console.log('\nreq.user?.userId:', req.user?.userId)
  if (!req.user?.userId) {
    // TODO: Check this, using jwt directly like below can cause unexpected problems!
    // const error = new jwt.TokenExpiredError('User Id Missing: Token Expired', new Date())
    return res.status(HttpStatusCode.Unauthorized).json({ message: 'userId missing' })
  }
  next()
})

/*
 * Error handlers
 *
 */

// To print with color in terminal
// console.log('\x1b[1m\x1b[31mAxios Error data:\x1b[0m')
/* api.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // Handle other errors
  console.error(err)
  res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
}) */

/* api.use((err, req, res, next) => {
  const statusCode = HttpStatusCode[err.statusCode] || HttpStatusCode.InternalServerError
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    message: message,
    error: {
      name: err.name,
      code: err.code,
      details: err.details, // If you have any additional error details
    },
  })
}) */

// All Articles
api.get('/articles', async (req, res, next) => {
  await db.read()
  if (!db.data.articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  const articles = db.data.articles.filter(article => article.userId === req.user.userId)
  if (!articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  res.status(HttpStatusCode.Ok).json(articles)
})

// One Article
api.get(`/articles/:id${onlyDigits}`, async (req, res, next) => {
  await db.read()
  const article = db.data.articles.find(a => a.id === req.params.id)
  if (!article) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(article)
})

// Update Article
api.patch(`/articles/:id${onlyDigits}`, async (req, res, next) => {
  let { title, content } = req.body
  title = title.replace(/\r\n|\r|\n/g, '')
  const modified = localDateStr()
  if (!title || !content || !modified)
   return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid article data' })

  // const articleId = parseInt(req.params.id, 10)
  // const articlesIndex = db.data.articles.findIndex(article => Number(article.id) === articleId)
  const articlesIndex = db.data.articles.findIndex(article => article.id === req.params.id)
  if (articlesIndex === -1) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })

  // Update db and return to client
  try {
    await db.read()
    db.data.articles[articlesIndex] = {...db.data.articles[articlesIndex], title, content, modified}
    await db.write()
  } catch (error) {
    console.error("Error updating article:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.articles[articlesIndex])
})

// Store new Article
api.post('/articles', authenticate, async (req, res, next) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid article data' })

  // Build new Article
  const newId = await getMaxId(db, 'articles') + 1
  const newDate = localDateStr()

  const newArticle = {
    id: newId.toString(),
    title,
    content,
    created: newDate,
    modified: newDate,
    userId: req.user.userId
  }

  // Insert into db and return to client
  try {
    await db.read()
    await db.update(({ articles }) => articles.push(newArticle))
    res.status(HttpStatusCode.Created).json(newArticle)
  } catch (error) {
    console.error("Error creating article:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }
})

// Delete Article
api.delete(`/articles/:id${onlyDigits}`, async (req, res) => {
  const articlesIndex = db.data.articles.findIndex(article => article.id === req.params.id)
  if (articlesIndex === -1) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })

  // Remove article from db
  try {
    await db.read()
    db.data.articles.splice(articlesIndex, 1)
    await db.write()
  } catch (error) {
    console.error("Error removing article:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.articles)
})

// One User
api.get([`/users/:id${onlyDigits}`/* , `/profile/:id${onlyDigits}` */], async (req, res, next) => {
  await db.read()
  const user = db.data.users.find(u => u.id === req.params.id)
  if (!user) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(user)
})

// Update User
api.patch(`/users/:id${onlyDigits}`, async (req, res, next) => {
  let { firstName, lastName, email } = req.body
  const modified = localDateStr()
  if (!firstName || !email || !modified)
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })

  const usersIndex = db.data.users.findIndex(user => user.id === req.params.id)
  if (usersIndex === -1) return res.status(HttpStatusCode.NotFound).json({ message: 'User not found' })

  // Update db and return to client
  try {
    await db.read()
    db.data.users[usersIndex] = {...db.data.users[usersIndex], firstName, lastName, email, modified}
    await db.write()
  } catch (error) {
    console.error("Error updating user:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.users[usersIndex])
})

// Create/Register user
api.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body
  if (!firstName || !lastName || !email || !password || !passwordConfirm)
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })

  if (password !== passwordConfirm) return res.status(HttpStatusCode.BadRequest).json({ message: 'Passwords not equal' })

  // Build new User
  const newId = await getMaxId(db, 'users') + 1
  const newDate = localDateStr()

  const hashedPasswordPlusSalt = await hashPassword(password)
  const arrHashedPasswordPlusSalt = hashedPasswordPlusSalt.split('.')
  const hashedPassword = arrHashedPasswordPlusSalt[0]
  const salt = arrHashedPasswordPlusSalt[1]

  const newUser = {
    id: newId.toString(),
    firstName,
    lastName,
    email,
    password: hashedPassword,
    salt,
    created: newDate,
    modified: newDate
  }

  // Insert into db and return to client
  try {
    await db.read()
    await db.update(({ users }) => users.push(newUser))
    const userId = newUser.id
    const jwtToken = await generateToken(userId)
    // res.status(HttpStatusCode.Created).json({ newUser, userId, jwtToken })
    res.status(HttpStatusCode.Created).json({ userId, jwtToken })
  } catch (error) {
    console.error("Error creating user:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }
})

api.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })
  const user = db.data.users.find(u => u.email === email)
  if (!user || !user.id) res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid credentials' })

  const passwordCompare = await comparePassword(password, user.password, user.salt)
  if (!passwordCompare) res.status(HttpStatusCode.Unauthorized).json({ message: 'Password compare failed' })

  // Next step, to have a server cookie and handle all
  // authentication and authorization on the server
  // const token = jwt.sign({ userId: user.id }, env('JWT_SECRET'), { expiresIn: '1h' })
  // const token = generateToken(user.id)
  // res.cookie('authToken', token, {
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   secure: true, // Set to true in production (HTTPS)
  // })

  const userId = user.id
  const jwtToken = await generateToken(userId)
  // console.log('userId:', userId)
  // console.log('jwtToken:', jwtToken)
  res.status(HttpStatusCode.Ok).json({ userId, jwtToken })
})

api.get('/verify', async (req, res, next) => {
})

// Serve index.html for all other routes on app
app.get('*', async (req, res) => {
  let modifiedIndexHtml
  if (!fileExists(indexHtmlPath)) {
    console.error("Couldn't find index.html")
    return
  }
  try {
    const indexHtml = await readFile(indexHtmlPath, 'utf8')
    modifiedIndexHtml = indexHtml.replace('{{CSS_PATH}}', IS_LIVE ? envConfigVars.CSS_PATH : envFileVars.CSS_PATH)
  } catch(error) {
    console.error("Error reading index.html:\n", error)
    return res.status(HttpStatusCode.InternalServerError).send({ message: 'Error reading index.html', error })
  }
  res.send(modifiedIndexHtml)
  // res.sendFile(indexHtmlPath)
})

// Start server
app.listen(IS_LIVE ? envConfigVars.PORT : envFileVars.PORT, () => {
  console.log('\nenvFileVars:', envFileVars)

  console.log('\nenvConfigVars:', envConfigVars)

  console.log(`\nBuild env: ${NODE_ENV}`)
  console.log(`Running env: ${RUN_ENV}`)

  console.log(`\nAPI Server running on port ${IS_LIVE ? envConfigVars.PORT : envFileVars.PORT}`)

  console.log('process.env:', process.env)
})
