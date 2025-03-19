export const __filename = import.meta.filename
export const __dirname = import.meta.dirname

/*
 * These are set in the different npm run-scripts
 * after the principle that everything is run
 * live/remotely and in production unless
 * otherwise stated. That way, there is
 * less and less clutter the closer
 * we are to the finished app.
 */
export const NODE_ENV = process.env.NODE_ENV || 'production'
export const RUN_ENV  = process.env.RUN_ENV  || 'live'

export const DEV_ENV  = process.env.NODE_ENV === 'development'
export const TEST_ENV = process.env.NODE_ENV === 'test'
export const PROD_ENV = process.env.NODE_ENV === 'production'
export const IS_LOCAL = process.env.RUN_ENV  === 'local'
export const IS_LIVE  = !IS_LOCAL

export const BUILD_DIR = 'dist'
