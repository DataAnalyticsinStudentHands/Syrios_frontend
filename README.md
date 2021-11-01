# SYRIOS Frontend 

This is the client-side interface for the Syrios project. It is built with Create-React-App, React-Router, React-Bootstrap, and Axios. It uses a lightweight [Strapi](https://strapi.io/) based content managment system.

A live demo of the development version can be found at: 

## For Developers
After cloning, run the following inside the project folder.
    `npm install`
    `npm start`
    
## Configuration:

Change the variable found in config/.env.js e.g.:

    `axiosBaseURL: "http://localhost:1337/"`

## Deployment

We are following standard procedures for a Create-React-App [deployment](https://create-react-app.dev/docs/deployment/) following a [build](https://create-react-app.dev/docs/production-build/). 

### Staging

We use pm2 and run e.g.:

`pm2 serve build 5000 --spa`

### Production

The build folder is transferred into the document folder of a Apache webserver.


