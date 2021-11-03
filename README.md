# The SYRIOS project

The SYRIOS Project began in 2016 both as an outgrowth of research into ancient Syria and in response to the current crisis within the modern region. By focusing on the dynamic presentation of Syrian material culture and the stories of its cities within the Greco-Roman period, we seek to:

- transform public awareness of the ancient world and Syria in particular
- revitalize the perception of Syria as a diverse and vibrant metropolitan region
- exemplify the power of objects as testimony to everyday lives and struggles
- offer historical professionals an enhanced, digital data source and model applicable to research, teaching, and community outreach
- invite new perspectives into the research and engagement with this historic place

This github repository branch contains the code for release v1 (the front-end as well as the backen-end).
A fully functioning demo and more information about the project can be found at: [syrios.uh.edu](https://syrios.uh.edu)


## Prerequisites

[https://nodejs.org/en/](Node.js)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The folder structure is inspired by [FullstackReact](https://github.com/fullstackreact/food-lookup-demo)

The backend is using [mongoose](https://mongoosejs.com/) to connect to a MongoDB. Please make sure you have your connection string set in a `.env` file.
Another setting is the base URL used for Axios: e.g. `REACT_APP_SYRIOS_API_ENDPOINT='http://localhost:3000'`

## Run your code locally

`git clone ..`

### Install missing packages

`cd client`

`npm install`

and for the backend

`cd backend`

`npm install`

### Run in development mode

Run each part separately with:

 `npm run start`

## Deployment
 `cd client`
 
 `npm run build`

Builds the app for production to the `build` folder inside client.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

Currently, the client has hard-coded connection strings to connect to the backend. That needs to be fixed.

### Run in production

The client code from the build folder is served as static from the Apache Document Root.

We are using [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) to manage deployment of the backend part on a production server. Run

`pm2 start pm2.config.js` to start the backend (served at port 3000). We have a Apache proxy setup.




