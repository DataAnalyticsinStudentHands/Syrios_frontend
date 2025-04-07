# SYRIOS Frontend 

This is the client-side interface for the Syrios project. It is built with Create-React-App. It uses a lightweight [Strapi](https://strapi.io/) content managment system.

A live demo of the production version is the [Syrios website](https://syrios.uh.edu/)

## For Developers
After cloning, run the following inside the project folder.

```
npm install
npm run start
```
    
### Environment variables

We are using [environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables) and the following must exists:

`REACT_APP_strapiURL=https://syrios.cs.uh.edu`

`REACT_APP_API_URL=https://syrios.cs.uh.edu/api` (is an artifact of earlier devlopment and will be removed in a future version)

`REACT_APP_UPLOAD_URL=https://syrios.cs.uh.edu`

Optional:

`REACT_APP_PRODUCTION=development` (set to production for production)

