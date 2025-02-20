import path from 'node:path'
import express from 'express'
import cors from 'cors'
import { JSONFilePreset } from 'lowdb/node'
import { DB_PATH, HOST, PORT, PROTOCOL} from './constants.js'
import { generateToken, getMaxId, localDateStr } from './functions.js'
import './config.js'

const app = express()
app.use(cors())
app.use(express.json())

// const defaultData = {
//   "articles": [
//     {
//       "id": "6503",
//       "title": "Test",
//       "content": "Testar",
//       "created": "2025-03-15 01:32:23",
//       "modified": "2025-03-15 01:32:23",
//       "userId": "1"
//     },
//     {
//       "id": "6504",
//       "title": "Test 2",
//       "content": "Testar 2",
//       "created": "2025-03-15 01:52:51",
//       "modified": "2025-03-15 01:52:51",
//       "userId": "1"
//     }
//   ],
//   "users": [
//     {
//       "id": "1",
//       "firstname": "Mikael",
//       "lastname": "Wallin",
//       "email": "mikael.wallin@yahoo.se",
//       "password": "ldkfgjhalkjgelgjfdhlgkjfhglkjfh",
//       "salt": "argaegre",
//       "created": "2025-03-15 02:32:23",
//       "modified": "2025-03-15 02:32:23"
//     }
//   ]
// }
const defaultData = { "articles": [], "users": [] }

// Read data
const filePath = path.resolve(DB_PATH)
const db = await JSONFilePreset(filePath, defaultData)

// All Articles
app.get('/articles', async (req, res) => {
  await db.read()
  if (!db.data.articles) res.status(404).json({ message: 'No Articles found' })

  res.json(db.data.articles)
})

// One Article
app.get('/articles/:id([0-9]+)', async (req, res) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(400).json({ message: 'Invalid article ID' })

  const articleId = parseInt(req.params.id, 10)
  await db.read()
  const article = db.data.articles.find(a => Number(a.id) === articleId) || null
  if (!article)
    res.status(404).json({ message: 'Article not found' })

  res.json(article)
  console.log('GET request for Article successful!')
})

// Update Article
app.patch('/articles/:id([0-9]+)', async (req, res) => {
  if (!Number.isInteger(Number(req.params.id)))
    return res.status(400).json({ message: 'Invalid article ID' })

  const articleId = parseInt(req.params.id, 10)
  await db.read()
  const article = db.data.articles.find(a => Number(a.id) === articleId) || null
  if (!article)
    res.status(404).json({ message: 'Article not found' })

  // Build new Article
  const { title, content } = req.body
  const newDate = localDateStr()

  const newArticle = {
    id: article.id,
    title,
    content,
    created: article.created,
    modified: newDate,
    userId: 1
  }

  console.log('New Article:', newArticle)

  // Update db and return to client
  try {
    await db.update(({ articles }) => {
      const updatedArticle = articles.find(article => article.id === articleId)
      updatedArticle.title = title
      updatedArticle.content = content
      updatedArticle.modified = newDate
    })
    res.status(200).json(newArticle)
  } catch (error) {
    console.error("Error updating article:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Store new Article
app.post('/articles', async (req, res) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(400).json({ message: 'Invalid article data' })

  // Build new Article
  const newId = await getMaxId(db, db.data.articles) + 1
  const newDate = localDateStr()

  const newArticle = {
    id: newId,
    title,
    content,
    created: newDate,
    modified: newDate,
    userId: 1
  }

  console.log('New Article:', newArticle)

  // Insert into db and return to client
  try {
    await db.read()
    await db.update(({ articles }) => articles.push(newArticle))
    res.status(201).json(newArticle)
  } catch (error) {
    console.error("Error creating article:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body
  if (!firstName || !lastName || !email || !password || !passwordConfirm)
    return res.status(400).json({ message: 'Invalid user data' })
  if (password !== passwordConfirm) return res.status(400).json({ message: 'Passwords not equal' })

  // Build new User
  const newId = await getMaxId(db, db.data.users) + 1
  const newDate = localDateStr()

  const newUser = {
    id: newId,
    firstname: firstName,
    lastname: lastName,
    email,
    password: hashedPassword,
    salt,
    created: newDate,
    modified: newDate
  }

  console.log('New User:', newUser)

  // Insert into db and return to client
  try {
    await db.read()
    await db.update(({ users }) => users.push(newUser))
    res.status(201).json(newUser)
  } catch (error) {
    console.error("Error creating user:\n", error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Invalid user data' })
  const user = db.users.find(u => u.email === email && u.password === password)

  if (!user) res.status(401).json({ message: 'Invalid credentials' })

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict'
  })

  // Use this!
  // timingSafeEqual

  res.json({ token: generateToken(user.id) })
})

app.get('/verify', async (req, res) => {
})

app.listen(PORT, HOST, () => {
  console.log(`API Server running on ${PROTOCOL}${HOST}:${PORT}`)
})
