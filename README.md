# The SYRIOS project

The SYRIOS Project began in 2016 both as an outgrowth of research into ancient Syria and in response to the current crisis within the modern region. By focusing on the dynamic presentation of Syrian material culture and the stories of its cities within the Greco-Roman period, we seek to:

- transform public awareness of the ancient world and Syria in particular
- revitalize the perception of Syria as a diverse and vibrant metropolitan region
- exemplify the power of objects as testimony to everyday lives and struggles
- offer historical professionals an enhanced, digital data source and model applicable to research, teaching, and community outreach
- invite new perspectives into the research and engagement with this historic place

This github repository contains the code for both the front-end and backen-end.
A fully functioning demo and more information about the project can be found at: [syrios.uh.edu](https://syrios.uh.edu)


## Prerequisites

[https://nodejs.org/en/](Node.js)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The folder structure is inspired by [FullstackReact](https://github.com/fullstackreact/food-lookup-demo)

The backend is using [mongoose](https://mongoosejs.com/) to connect to a MongoDB. Please make sure you have your connection string set in a `.env` file.
Another setting is teh base URL used for Axios: e.g. `SYRIOS_APP_API_ENDPOINT='http://localhost:3000'`

## Run your code locally

`git clone ..`

`cd Syrios_frontend`

### Install missing packages

`cd Syrios_frontend`

`npm install`

`cd client`

`npm install`

`cd..`

### Run in development mode
 `npm start`

Front-end and backend are both served through an Express server.<br>
Open [http://localhost:3000](http://localhost:3000) to view the Syrios Project in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

If you would like to test the client without the backend running you can use

`npm run client`

## Deployment
 `cd client`
 
 `npm run build`

Builds the app for production to the `build` folder inside client.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Currently, the client has hard-coded connection strings to connect to the backend. That needs to be fixed.

### Run in production

We are using [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) to manage deployment on a production server. Run

`pm2 start server.js`

to start the app (fornt-end and backend). The app is served at port 3000.

The 'module.exports' function doesn't work in production. Create a GraphQL schema within the native file.




