# The SYRIOS project

The SYRIOS Project began in 2016 both as an outgrowth of research into ancient Syria and in response to the current crisis within the modern region. By focusing on the dynamic presentation of Syrian material culture and the stories of its cities within the Greco-Roman period, we seek to:

- transform public awareness of the ancient world and Syria in particular
- revitalize the perception of Syria as a diverse and vibrant metropolitan region
- exemplify the power of objects as testimony to everyday lives and struggles
- offer historical professionals an enhanced, digital data source and model applicable to research, teaching, and community outreach
- invite new perspectives into the research and engagement with this historic place

This github repository contains the code for both the front-end and backen-end.
A fully functioning demo and more information about the project can be found at: [syrios.uh.edu](https://syrios.uh.edu)


### Prerequsites

[https://nodejs.org/en/](Node.js)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The folder structure and setup is inspired by [FullstackReact](https://github.com/fullstackreact/food-lookup-demo)

### Run your code locally

`git clone https://github.com/peggylind/FindingConnectionsAncientSyria`

`cd FindingConnectionsAncientSyria`

#### Install missing packages

`cd FindingConnectionsAncientSyria`

`npm install`

`cd client`

`npm install`

`cd..`

#### Development
 `npm start`

Runs the two apps concurrently in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view Syrios Project in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

The backend is running on port 3002. It is using [mongoose](https://mongoosejs.com/) to connect to a MongoDB. Please make sure you have your connection string set in a `.env` file.

### Deployment
 `cd client`
 
 `npm run build`

Builds the app for production to the `build` folder inside client.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Production

We are using [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) to manage deployment on a production server. Run

`pm2 start start-client.js` and

`pm2 start server.js`

to start the separte backend and front-end processes.

#### Other
`npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

