This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Publish your code on Server

1. Download and install Cisco AnyConnect VPN secure mobility client. 

2. Enter 'full-vpn.uh.edu' and connect to the server. Set the Group to full-vpn and enter your CougarNet credentials to connect successfully.

3. Open terminal and enter the following command 'ssh -l [username] hnetdev.hnet.uh.edu' by placing your username and enter your corresponding password. 

4. Now, to access webadmin, enter 'sudo su - webadmin' followed by the password to enter webadmin@hnetdev. 

5. You can see the list in the directory with command 'ls'. Enter 'cd FindingConnectionsAncientSyria.git/' and pull the latest version by 'git pull' command.

6. After the changes are updated, run 'npm run build' to build the app for production. It correctly bundles React in production mode and optimizes the build for the best performance.

7. Move back a folder by 'cd ..' and edit the syrios_3000.json file. You can use vim editor by running 'vi syrios_3000.json'

8. The script holds the path that points to start.js which triggers the application to build. You can choose the port to be on 3000. 

9. PM2 is a process manager and manages your application states. The 'pm2 start node_modules/react-scripts/scripts/start.js --name syrios' command allows you to start the process.

10. Enter 'pm2 list' to check existing processes and it's status. 

11. You can stop the process with 'pm2 stop syrios', restart with 'pm2 restart syrios', delete with 'pm2 delete syrios'

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
