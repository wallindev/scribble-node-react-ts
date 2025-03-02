import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { existsSync as fileExists } from 'node:fs'
import { join as pathJoin } from 'node:path'
import { promisify as nodePromisify } from 'node:util'
import mime from 'mime/lite'
import jwt from 'jsonwebtoken'
const scryptAsync = nodePromisify(scrypt)
import { __filename, __dirname } from './constants.js'

/*
 * DB functions
 */

export const getMaxId = async (db, table) => {
  await db.read()
  if (!db.data || !db.data[table] || db.data[table].length === 0) return 0
  return db.data[table].reduce((maxId, row) => Math.max(maxId, parseInt(row.id, 10)), 0)
}

/*
 * User authorization functions
 */

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex')
  const buffer = await scryptAsync(password, salt, 64)
  const hashedPassword = buffer.toString('hex')
  return `${hashedPassword}.${salt}`
}

export const comparePassword = async (password, dbPassword, dbSalt) => {
  try {
    const passwordBuffer = await scryptAsync(password, dbSalt, 64)
    const hashedPasswordBuffer = Buffer.from(dbPassword, 'hex')
    if (passwordBuffer.length !== hashedPasswordBuffer.length) return false
    return timingSafeEqual(passwordBuffer, hashedPasswordBuffer)
  } catch (error) {
    console.error("Error comparing passwords:\n", error)
    return false
  }
}

// Use httpOnly and secure cookies in next version!
export const generateToken = (userId) => {
  // const secretKey = process.env.JWT_SECRET
  // const secretKey = env('JWT_SECRET')
  const token = jwt.sign({ userId }, env('JWT_SECRET'), { expiresIn: '1h' })
  return token
}

export const secretKey = randomBytes(32).toString('hex') // 32 bytes = 256 bits

/*
 * General functions
 */

// Short-form of process.env.KEY
export const env = (key) => process.env[key]

export const localDateStr = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString('sv-SE', { timeZone: 'CET' })
}

export const imgToBase64 = async (relPathToImg) => {
  const filePath = pathJoin(__dirname, relPathToImg)
  if (!fileExists(filePath)) throw new Error("File doesn't exist")
  // console.log('filePath:', filePath)

  const mimeType = mime.getType(filePath)
  if (!mimeType) throw new Error("Couldn't determine filetype")
  // console.log('mimeType:', mimeType)

  try {
    const imgData = await readFile(filePath)
    const base64Str = imgData.toString('base64')
    const base64Url = `data:${mimeType};base64,${base64Str}`
    // console.log('base64Url:', `${base64Url.substring(0, 100)}...`)
    return base64Url
  } catch (error) {
    console.error("Error when converting image to base64 string:\n", error)
    throw error
  }
}
// await imgToBase64('GitHub.jpg')
