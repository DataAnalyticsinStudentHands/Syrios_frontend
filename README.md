# SYRIOS Frontend 

This is the client-side interface for the Syrios project. It is built with Create-React-App. It uses a lightweight [Strapi](https://strapi.io/) content managment system.

A live demo of the development version can be found at: 

## For Developers
After cloning, run the following inside the project folder.

```
npm install
npm run start
```
    
### Configuration

To connect with the Strapi backend, set the strapi url in the .env like so

`REACT_APP_strapiURL=http://localhost:1337`


For information about deployment, please refer to the [documentation](https://github.com/DataAnalyticsinStudentHands/Syrios_frontend/wiki/Deployment).


### Deployment to syrios.uh.edu/dev/

After cloning, edit the package.json and add a homepage variable like so:
```"homepage": "/dev"```

Next, edit the App.js under src folder and change the `BrowserRouter` `basename` key variable to `'/dev'` like so:
```
<BrowserRouter basename='/dev'>
{/* some routing */}
</BrowserRouter>
```

After doing those two changes, run these commands in the project root (as syrioswebadmin):
`npm i && npm audit fix && npm run build && rm -rf /var/www/html/dev/* && cp -r build/* /var/www/html/dev/`
