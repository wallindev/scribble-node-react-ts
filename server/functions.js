import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { existsSync as fileExists } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'
import mime from 'mime/lite'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const scryptAsync = promisify(scrypt)
const decodeJwtSync = jwt.decode
const signJwtAsync = promisify(jwt.sign)
const verifyJwtAsync = promisify(jwt.verify)
import { __dirname, IS_LIVE } from './constants.js'
import { envFileVars, envConfigVars } from './config.js'

/*
 * Mail functions
 */
export const sendVerifyEmail = async (toEmail, verifyToken, host) => {
  const verificationUrl = `${host}/verify/${verifyToken}`
  const verificationLink = `<a href="${verificationUrl}">${verificationUrl}</a>`
  const subject = 'Verify Your Email'
  const body = `<p>Please click this link to verify your email:</p>
<p>${verificationLink}</p>`
  await sendEmail(toEmail, subject, body)
}

export const sendEmail = async (to, subject, html) => {
  // console.log('EMAIL_USER:', process.env.EMAIL_USER)
  // console.log('EMAIL_PASS:', process.env.EMAIL_PASS)
  // console.log('to:', to)
  // console.log('subject:', subject)
  // console.log('html:', html)
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: false,
    logger: true,
  })

  const mailOptions = {
    // from: 'Scribble-admin <admin@scribbleapp.com>',
    from: 'Mikael Wallin <mikael.wallin@yahoo.se>',
    to,
    subject,
    html,
  }
  // console.log('mailOptions:', mailOptions)
  // return

  await transporter.sendMail(mailOptions)
}

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

export const secretKey = randomBytes(32).toString('hex') // 32 bytes = 256 bits

// Use httpOnly and secure cookies instead of localStorage
// in next version of this JWT handling!

export const decodeJwtToken = (token, secret) => {
  try {
    return decodeJwtSync(token, secret)
  } catch (err) {
    throw err
  }
}

export const signJwtToken = async (payload, secret, options = {}) => {
  try {
    return await signJwtAsync(payload, secret, options)
  } catch (err) {
    throw err
  }
}

export const verifyJwtToken = async (payload, secret) => {
  try {
    return await verifyJwtAsync(payload, secret)
  } catch (err) {
    throw err
  }
}

export const readToken = (token) => decodeJwtToken(token, IS_LIVE ? envConfigVars.SECRET_AUTH : envFileVars.SECRET_AUTH)

export const generateToken = async (payload, type = 'auth', options = {}) => {
  let secretKey = ''
  if (type === 'verify') {
    secretKey = IS_LIVE ? envConfigVars.SECRET_VERIFY : envFileVars.SECRET_VERIFY
  } else {
    secretKey = IS_LIVE ? envConfigVars.SECRET_AUTH : envFileVars.SECRET_AUTH
  }
  return await signJwtToken(payload, secretKey, { expiresIn: '1h' })
}

export const validateToken = async (payload, type = 'auth') => {
  let secretKey = ''
  if (type === 'verify') {
    secretKey = IS_LIVE ? envConfigVars.SECRET_VERIFY : envFileVars.SECRET_VERIFY
  } else {
    secretKey = IS_LIVE ? envConfigVars.SECRET_AUTH : envFileVars.SECRET_AUTH
  }

  return await verifyJwtToken(payload, secretKey)
}

// Decode and read token data from auth header
export const validateTokenDataFromHeader = async (headers) => {
  const authHeader = headers.authorization
  if (!authHeader) return null
  const token = authHeader.split(' ')[1]
  if (!token) return null
  try {
    const tokenData = await validateToken(token)
    // console.log('validateTokenDataFromHeader, tokenData:', tokenData)
    return tokenData
  } catch (error) {
    throw error
  }
}

// Read token data from auth header
export const readTokenDataFromHeader = (headers) => {
  console.log('readTokenDataFromHeader')
  const authHeader = headers.authorization
  if (!authHeader) return null
  const token = authHeader.split(' ')[1]
  if (!token) return null
  try {
    const tokenData = readToken(token)
    console.log('readTokenDataFromHeader, tokenData:', tokenData)
    return tokenData
  } catch (error) {
    throw error
  }
}

export const authTokenValid = () => {
  const tokenData = getTokenData()
  if (!tokenData) return false
  const tokenDataJson = JSON.parse(tokenData)
  const tokenTimestamp = tokenDataJson.expires
  if (!tokenTimestamp) return false
  // console.log('tokenTimestamp:', tokenTimestamp)
  // console.log('Date.now():', Date.now())
  // console.log('Date.now() <= tokenTimestamp:', Date.now() <= tokenTimestamp)
  return Date.now() <= tokenTimestamp
}

/*
 * General functions
 */

// Short-form of process.env.KEY
export const env = (key) => process.env[key] || null

export const localDateStr = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
}

export const imgToBase64 = async (relPathToImg) => {
  const filePath = join(__dirname, relPathToImg)
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
