# node-react-ts
Frontend is a React/TypeScript SPA (Single Page Application), backend is a Node/Express server that provides API to a lowdb JSON file database, and also serves the HTML page where the React app is run.

Created with Vite, but later decoupled so that Vite now only runs the development mode with HMR (Hot Module Reloading). The finished build/React app is completely self-sustaining and runs in the HTML page that Express serves, and uses the Node/Express API to fetch the data from lowdb.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
