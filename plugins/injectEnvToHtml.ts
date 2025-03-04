import fs from 'fs'
import path from 'path'
import { Plugin } from 'vite'

const injectEnvToHtml = (): Plugin => {
  return {
    name: 'injectEnvToHtml',
    transformIndexHtml: {
      order: 'pre',
      handler(html, _ctx) {
        for (let [key, value] of Object.entries(parseEnvFile()))
          html = html.replace(new RegExp(`{{${key}}}`, 'g'), value)

        return html
      }
    }
  }
}

const parseEnvFile = (): Record<string, string> => {
  let filePathEnv
  try {
    filePathEnv = path.resolve('./server/.env')
    if (!filePathEnv) {
      console.error('Env file not found')
      return {}
    }
    const fileContent = fs.readFileSync(filePathEnv, 'utf-8')
    const lines = fileContent.split('\n')
    const envVars: Record<string, string> = {}

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, value] = trimmedLine.split('=', 2)
        if (key && value) {
          envVars[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '') // Remove single and double quotation marks from value
        }
      }
    }
    return envVars
  } catch (error) {
    console.error(`Error reading or parsing '${filePathEnv}' file:\n${error}`)
    return {}
  }
}

export default injectEnvToHtml