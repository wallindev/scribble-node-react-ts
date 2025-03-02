import path from 'node:path'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { existsSync as fileExists } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { HttpStatusCode } from 'axios'
import { JSONFilePreset } from 'lowdb/node'
import 'dotenv/config'
import { __filename, __dirname } from './constants.js'
import { env, generateToken, getMaxId, localDateStr, hashPassword, comparePassword } from './functions.js'
import './config.js'

const app = express()
app.use(cors())
app.use(express.json())

// Read db to memory
const filePath = path.resolve(env('DB_PATH'))
const db = await JSONFilePreset(filePath, { articles: [], users: [], tokens: [] })
const apiRoot = '/api'
const onlyDigits = '([0-9]+)'

/*
 * Middlewares
 *
 */

// Default article id param check
app.use(`${apiRoot}/articles/:id${onlyDigits}`, (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(400).json({ message: 'Invalid article ID' })
  next()
})

// Default user id param check
app.use([`${apiRoot}/users/:id${onlyDigits}`, `${apiRoot}/profile/:id${onlyDigits}`], (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(400).json({ message: 'Invalid user ID' })
  next()
})

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('authHeader:', authHeader)
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'))
    req.user = decoded // Attach user data to request
    next()
  } catch (err) {
    console.error('jwt token error:', err)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
/* Error handlers
 *
 */
// To print with color in terminal
// console.log('\x1b[1m\x1b[31mAxios Error data:\x1b[0m')
app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // Handle other errors
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    message: message,
    error: {
      name: err.name,
      code: err.code,
      details: err.details, // If you have any additional error details
    },
  })
})

// All Articles
app.get(`${apiRoot}/articles`, authenticate, async (req, res, next) => {
  await db.read()
  if (!db.data.articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  const articles = db.data.articles.filter(article => article.userId === req.user.userId)
  if (!articles) return res.status(HttpStatusCode.NotFound).json({ message: 'No Articles found' })
  res.status(HttpStatusCode.Ok).json(articles)
})

// One Article
app.get(`${apiRoot}/articles/:id${onlyDigits}`, async (req, res, next) => {
  await db.read()
  const article = db.data.articles.find(a => a.id === req.params.id)
  if (!article) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(article)
})

// One User
app.get([`${apiRoot}/users/:id${onlyDigits}`, `/profile/:id${onlyDigits}`], async (req, res, next) => {
  await db.read()
  const user = db.data.users.find(u => u.id === req.params.id)
  if (!user) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })
  res.status(HttpStatusCode.Ok).json(user)
})

// Update Article
app.patch(`${apiRoot}/articles/:id${onlyDigits}`, async (req, res, next) => {
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
    res.status(500).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.articles[articlesIndex])
})

// Store new Article
app.post(`${apiRoot}/articles`, authenticate, async (req, res, next) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(400).json({ message: 'Invalid article data' })

  console.log('title:', title)
  console.log('content:', content)

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

  console.log('New Article:', newArticle)

  // Insert into db and return to client
  try {
    await db.read()
    await db.update(({ articles }) => articles.push(newArticle))
    res.status(HttpStatusCode.Created).json(newArticle)
  } catch (error) {
    console.error("Error creating article:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete Article
app.delete(`${apiRoot}/articles/:id${onlyDigits}`, async (req, res) => {
  const articlesIndex = db.data.articles.findIndex(article => article.id === req.params.id)
  if (articlesIndex === -1) return res.status(HttpStatusCode.NotFound).json({ message: 'Article not found' })

  // Remove article from db
  try {
    await db.read()
    db.data.articles.splice(articlesIndex)
    await db.write()
  } catch (error) {
    console.error("Error removing article:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.articles)
})

// Update User
app.patch(`${apiRoot}/users/:id${onlyDigits}`, async (req, res, next) => {
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
    res.status(500).json({ message: 'Internal server error' })
  }
  res.status(HttpStatusCode.Ok).json(db.data.users[usersIndex])
})

app.post(`${apiRoot}/login`, async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Invalid user data' })
  const user = db.data.users.find(u => u.email === email)
  if (!user || !user.id) res.status(401).json({ message: 'Invalid credentials' })

  const passwordCompare = await comparePassword(password, user.password, user.salt)
  if (!passwordCompare) res.status(401).json({ message: 'Password compare failed' })

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
  const jwtToken = generateToken(userId)
  res.json({ userId, jwtToken })
})

// Register user
app.post(`${apiRoot}/register`, async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body
  if (!firstName || !lastName || !email || !password || !passwordConfirm)
    return res.status(400).json({ message: 'Invalid user data' })

  if (password !== passwordConfirm) return res.status(400).json({ message: 'Passwords not equal' })

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
    const jwtToken = generateToken(userId)
    // res.status(HttpStatusCode.Created).json({ newUser, userId, jwtToken })
    res.status(HttpStatusCode.Created).json({ userId, jwtToken })
  } catch (error) {
    console.error("Error creating user:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get(`${apiRoot}/verify`, async (req, res, next) => {
})

// Static files and index.html
const buildPath = path.join(__dirname, '../', 'dist')
const indexPath = path.join(buildPath, 'index.html')

app.use(express.static(buildPath))

// Serve index.html for all other routes (handle this last)
app.get('*', async (req, res) => {
  let modifiedHtml
  try {
    const fl = await readFile(indexPath, 'utf8')
    modifiedHtml = fl.replace('{{CSS_PATH}}', env('CSS_PATH'))
  } catch(error) {
    console.error("Error reading index.html:\n", error)
    return res.status(500).send({ message: 'Error reading index.html', error })
  }

  res.send(modifiedHtml)
  // res.sendFile(indexPath)
})

// Start server
app.listen(env('PORT'), env('HOST'), () => {
  console.log(`API Server running on ${env('PROTOCOL')}${env('HOST')}:${env('PORT')}`)
})
