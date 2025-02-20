import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import jwtSign from 'jsonwebtoken'
const scryptAsync = promisify(scrypt)

/*
 * DB functions
 */

export const getMaxId = async (db, table) => {
  await db.read()
  if (!db.data || !db.data[table] || db.data[table].length === 0) return 0
  return db.data.articles.reduce((maxId, article) => Math.max(maxId, parseInt(article.id, 10)), 0)
}

/*
 * User authorization functions
 */

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex')
  const buffer = await scryptAsync(password, salt, 64)
  return `${buffer.toString('hex')}.${salt}`
}

export const comparePassword = async (password, dbPassword, dbSalt) => {
  // we need to pass buffer values to timingSafeEqual
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex")
  // we hash the new sign-in password
  const passwordBuf = (await scryptAsync(password, salt, 64))

  try {
    const hashedBuffer = Buffer.from(hashedPassword, 'hex');
    const providedBuffer = Buffer.from(providedPasswordHash, 'hex');

    if (hashedBuffer.length !== providedBuffer.length) {
      return false; // Prevent timing attack on length differences
    }

    return crypto.timingSafeEqual(hashedBuffer, providedBuffer);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

// Use httpOnly and secure cookies!
export const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET
  const token = jwtSign({ userId }, secretKey, { expiresIn: '1h' })
  return token
}

export const secretKey = randomBytes(32).toString('hex') // 32 bytes = 256 bits

/*
 * General functions
 */

export const localDateStr = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString('sv-SE', { timeZone: 'CET' })
}
