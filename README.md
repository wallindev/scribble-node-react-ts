# node-react-ts
Frontend is a React/TypeScript SPA (Single Page Application), backend is a Node/Express server that provides API to a lowdb JSON file database, and also serves the HTML page where the React app is run.

Created with Vite, but later decoupled so that Vite now only runs the development mode with HMR (Hot Module Reloading). The finished build/React app is completely self-sustaining and runs in the HTML page that Express serves, and uses the Node/Express API to fetch the data from lowdb.

## Available Scripts

In the project directory, you can run:

### `npm run api-dev`

Runs the app in development mode, with the Express server in the backend and the React SPA with HMR (Hot Module Reloading) in the frontend.<br>
[http://localhost:3000](http://localhost:3000) opens the Express API.
[http://localhost:5000](http://localhost:5000) opens the React SPA.

### `npm run build`

Builds the app to the 'dist' folder, the TypeScript is transpiled to Javascript and Vite bundles all assets.

### `npm start`

Starts the built app, with the Express backend that serves the API and the transpiled frontend React SPA.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
