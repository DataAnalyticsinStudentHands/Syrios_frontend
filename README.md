This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Publish your code on Server 'hnetdev.hnet.uh.edu'

1. You can access the server via ssh and is only allowed for UH IP addresses. You must use a VPN in order to access resources off-campus. Follow instructions from https://uh.edu/infotech/services/computing/networks/vpn/ to install VPN and access 'full-vpn.uh.edu'

2. Use ssh to connect 'hnetdev.hnet.uh.edu' with the command 'ssh -l [username] hnetdev.hnet.uh.edu' and pass your credentials to login.

3. The web applications can be accessed via user 'webadmin', use 'sudo su - webadmin' followed by the password.  

4. The application's code is synchronized via github with a cloned version present in FindingConnectionsAncientSyria.git/ in the home directory of user 'webadmin'. Pull the latest version i.e. via git pull command. 

5. Move inside the application's directory and test the app via 'npm start'. You might require to install npm packages via 'npm install'.

6. Build the app for production using 'npm run build'. It correctly bundles React in production mode and optimizes the build for the best performance. A directory called 'build' shall now exist.

7. Once everything is working and the production bundle has been built, move back to the home directory for webadmin. We are using PM2 as a process manager for our node.js based web apps. Use 'pm2 list' to check existing processes and status. The app should be listed as 'syrios' in PM2. 

8. You can stop the process with 'pm2 stop syrios', restart with 'pm2 restart syrios', delete with 'pm2 delete syrios'

9. To start the application if it is not listed, we have prepared a pm2 startup script 'syrios_3000.json' which can be found in the home directory for 'webadmin'. The script contains configuration parameters for the application such as port number and start script which can be modified as needed. 

10. If the script is missing or doesn't work, the command 'pm2 start node_modules/react-scripts/scripts/start.js --name syrios' executed inside the app directory allows you to add the process to pm2 manually. 

## Run your code locally

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
