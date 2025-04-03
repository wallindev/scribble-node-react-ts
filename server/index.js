import { join, resolve } from 'node:path'
import express from 'express'
import cors from 'cors'
import { existsSync as fileExists } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { HttpStatusCode } from 'axios'
import { JSONFilePreset } from 'lowdb/node'
import { __dirname, IS_LIVE, NODE_ENV, RUN_ENV, PROD_ENV, BUILD_DIR, liveHostUrl, localHostUrl } from './constants.js'
import { envFileVars, envConfigVars } from './config.js'
import { comparePassword, generateToken, getMaxId, hashPassword, localDateStr, readToken, sendVerifyEmail, validateToken, validateTokenDataFromHeader, readTokenDataFromHeader } from './functions.js'
// import './config.js'

/*
 * Global variables
 *
 */

// Directories and files
const buildPath = join(__dirname, '../', BUILD_DIR)
const indexHtmlPath = join(__dirname, '../', PROD_ENV ? BUILD_DIR : '', 'index.html')
const dbFilePath = resolve(IS_LIVE ? envConfigVars.DB_PATH : envFileVars.DB_PATH)
// console.log('\nbuildPath:', buildPath)
// console.log('indexHtmlPath:', indexHtmlPath)
// console.log('dbFilePath: ', dbFilePath)

// Read db to memory
const db = await JSONFilePreset(dbFilePath, { articles: [], users: [], tokens: [] })
// console.log('db: ', db)
// console.log('db.data: ', db.data)

const onlyDigits = '([0-9]+)'

/*
 * Express Server Config
 *
 */

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

/*
 * Middlewares
 *
 */

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const decodedTokenData = await validateTokenDataFromHeader(req.headers)
    const { userId, email, iat, exp } = decodedTokenData
    const issued = localDateStr(new Date(iat * 1000))
    const expires = localDateStr(new Date(exp * 1000))
    req.user = { userId, email, issued, expires }
    next()
  } catch (error) {
    console.log(`This is a ${error.name} error`)
    console.log('This error has these properties:', Object.keys(error))
    // console.log('error.name:', error.name)
    // console.log('error.message:', error.message)
    // console.log('error.stack:', error.stack)
    if (error.name === 'TokenExpiredError') {
      console.log('Error name:', error.name)
      console.log('Error message:', error.message)
      console.log('Token expired at:', error.expiredAt)
      console.log('Token expired at (local time):', localDateStr(error.expiredAt))
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Error message:', error.message)
      // console.error('Token verification failed:', error.message)
    } else {
      console.log('This is an unknown/unexpected JsonWebToken error')
      console.log('Error message:', error.message)
      // console.error('Unexpected JWT Error:', error.message)
    }
    return res.status(HttpStatusCode.Unauthorized).json({ error })
  }
}

// Default article id param check
api.use(`/articles/:id${onlyDigits}`, authenticate, (req, res, next) => {
  if (!Number.isInteger(Number(req.params?.id)))
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid Article Id' })
  next()
})

// Default user id param check
api.use(`/users/:id${onlyDigits}`, authenticate, (req, res, next) => {
  if (!Number.isInteger(Number(req.params?.id)))
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid User Id' })
  next()
})

// User id on protected resources
api.use(['/articles', '/users'], authenticate, (req, res, next) => {
  if (!req.user?.userId)
    return res.status(HttpStatusCode.Unauthorized).json({ message: 'userId missing' })
  next()
})

/*
 * Error handlers
 *
 */

// To print with color in terminal
// console.log('\x1b[1m\x1b[31mAxios Error data:\x1b[0m')

// Handles unexpected route errors
/* api.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // Handle other errors
  console.error(err)
  res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
}) */

// Handles unexpected route errors, with more detailed http status and error details
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
api.get('/articles', async (req, res) => {
  await db.read()
  if (!db.data.articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  const articles = db.data.articles.filter(article => article.userId === req.user.userId)
  if (!articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  res.status(HttpStatusCode.Ok).json(articles)
})

// One Article
api.get(`/articles/:id${onlyDigits}`, async (req, res) => {
  await db.read()
  const article = db.data.articles.find(a => a.id === req.params.id)
  if (!article) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(article)
})

// Update Article
api.patch(`/articles/:id${onlyDigits}`, async (req, res) => {
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
api.post('/articles', async (req, res) => {
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
api.get(`/users/:id${onlyDigits}`, async (req, res) => {
  await db.read()
  const user = db.data.users.find(u => u.id === req.params.id)
  if (!user) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(user)
})

// Update User
api.patch(`/users/:id${onlyDigits}`, async (req, res) => {
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
api.post('/register', async (req, res) => {
  let hostUrl = req.headers.origin
  if (!hostUrl)
    hostUrl = IS_LIVE ? liveHostUrl : localHostUrl

  const { reSend } = req.query
  if (reSend !== undefined) {
    const { userId, email } = req.body
    if (!userId || !email)
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })

    try {
      const verifyToken = await generateToken({ userId, email }, 'verify', { expiresIn: '10m' })
      await sendVerifyEmail(email, verifyToken, hostUrl)
      res.status(HttpStatusCode.Ok).json({ userId, email })
    } catch (error) {
      console.error("Error generating new verify token:\n", error)
      res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
    }
  } else {
    const { firstName, lastName, email, password, passwordConfirm } = req.body
    if (!firstName || !lastName || !email || !password || !passwordConfirm)
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })

    const usersIndex = db.data.users.findIndex(user => user.email === email)
    if (usersIndex !== -1) return res.status(HttpStatusCode.Conflict).json({ message: 'Email already exists' })

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
      emailVerified: false,
      password: hashedPassword,
      salt,
      created: newDate,
      modified: newDate
    }

    // Insert into db and return to client
    try {
      const verifyToken = await generateToken({ userId: newId, email }, 'verify', { expiresIn: '10m' })
      // console.log('verifyToken:', verifyToken)
      // console.log('hostUrl:', hostUrl)
      console.time('sendMail')
      await sendVerifyEmail(email, verifyToken, hostUrl)
      console.timeEnd('sendMail')
      await db.read()
      await db.update(({ users }) => users.push(newUser))
      const userId = newUser.id
      res.status(HttpStatusCode.Created).json({ userId })
    } catch (error) {
      console.error("Error creating user or generating verify token:\n", error)
      res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
    }
  }
})

// Verify user with email token, and set/send auth token
api.get('/verify', async (req, res) => {
  let { token } = req.query
  if (!token)
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid token' })

  let decode
  try {
     decode = await validateToken(token, 'verify')
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('TokenExpiredError: Token verification failed:', error.message)
      console.error('error.expiredAt:', localDateStr(error.expiredAt))
    } else if (error.name === 'JsonWebTokenError') {
      console.error('JsonWebTokenError: Token verification failed:', error.message)
    } else {
      console.error('Unexpected JWT Error:', error.message)
    }
    return res.status(HttpStatusCode.Unauthorized).json({ error })
  }

  const usersIndex = db.data.users.findIndex(user => user.email === decode.email)
  if (usersIndex === -1) return res.status(HttpStatusCode.NotFound).json({ message: 'User not found' })

  // Update db and return to client
  try {
    await db.read()
    db.data.users[usersIndex] = {...db.data.users[usersIndex], emailVerified: true}
    await db.write()
  } catch (error) {
    console.error("Error setting emailVerified to true:\n", error)
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal server error' })
  }

  const userId = db.data.users[usersIndex].id
  const email = db.data.users[usersIndex].email
  const authToken = await generateToken({ userId, email }, 'auth', { expiresIn: '10m' })
  const tokenData = readToken(authToken)
  console.log('token data:', tokenData)

  if (!tokenData || !tokenData?.userId || !tokenData?.email || !tokenData?.iat || !tokenData?.exp)
    res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid generated token data' })

  res.status(HttpStatusCode.Ok).json({
    userId: tokenData.userId,
    email: tokenData.email,
    issued: tokenData.iat * 1000,
    expires: tokenData.exp * 1000,
    authToken
  })
})

// Log in user with email and password, and set/send auth token
api.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data' })
  const user = db.data.users.find(u => u.email === email)
  if (!user || !user.id) return res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid credentials' })
  if (!user.emailVerified) return res.status(HttpStatusCode.Unauthorized).json({ message: 'Email not verified' })

  const passwordCompare = await comparePassword(password, user.password, user.salt)
  if (!passwordCompare) return res.status(HttpStatusCode.Unauthorized).json({ message: 'Password compare failed' })

  // Next step, to have a server cookie and handle all
  // authentication and authorization on the server
  // const authToken = await generateToken({ userId, email })
  // res.cookie('authToken', authToken, {
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   secure: true, // Set to true in production (HTTPS)
  // })

  const userId = user.id
  const authToken = await generateToken({ userId, email }, 'auth', { expiresIn: '10m' })
  const tokenData = readToken(authToken)

  if (!tokenData || !tokenData?.userId || !tokenData?.email || !tokenData?.iat || !tokenData?.exp)
    res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid generated token data' })

  res.status(HttpStatusCode.Ok).json({
    userId: tokenData.userId,
    email: tokenData.email,
    issued: tokenData.iat * 1000,
    expires: tokenData.exp * 1000,
    authToken
  })
})

// Route only used to view auth token
api.get('/token', (req, res) => {
  try {
    const tokenData = readTokenDataFromHeader(req.headers)
    console.log('tokenData:', tokenData)
    if (!tokenData)
      return res.status(HttpStatusCode.Unauthorized).json({ message: 'Authorization header or token missing' })
    if (!tokenData.exp || !Number.isInteger(tokenData.exp))
      return res.status(HttpStatusCode.Unauthorized).json({ message: 'Authorization header expire timestamp corrupt' })
    const tokenTimestamp = tokenData.exp * 1000
    const authenticated = Date.now() <= tokenTimestamp
    console.log('authenticated:', authenticated)
    res.status(HttpStatusCode.Ok).json({ authenticated })
  } catch (error) {
    console.error('Token read failed:', error.message)
    res.status(HttpStatusCode.Unauthorized).json({ error })
  }
})

// Serve index.html for all other routes on app
app.get('*', async (_, res) => {
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
  // console.log('\nenvFileVars:', envFileVars)
  // console.log('\nenvConfigVars:', envConfigVars)

  console.log(`\nBuild env: ${NODE_ENV}`)
  console.log(`Running env: ${RUN_ENV}`)
  console.log('\nEnv vars:', IS_LIVE ? envConfigVars : envFileVars)

  console.log(`\nAPI Server running on port ${IS_LIVE ? envConfigVars.PORT : envFileVars.PORT}`)

  // console.log('process.env:', process.env)
})
