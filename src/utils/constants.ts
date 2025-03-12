// Let's first try without port (and https), see what happens
export const API_URL = 'https://localhost/api'

// then, set the real URL. this should absolutely work
// export const API_URL = 'https://node-react-ts-33315b5eaefa.herokuapp.com/api'

// Local URL with PORT, causes Heroku to connect to
// "remote source" (which is my local app),
// since Heroku works without ports except for
// the dynamic port the whole Express app is bound
// to before it is started. after the app is started
// all API URL:s etc should be without ports
// export const API_URL = 'http://localhost:3000/api'
