/* @flow */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import fetch from 'node-fetch';
import Dataloader from 'dataloader';
import schema from './schema/Schema';

const port = process.env.PORT || 3000;
const app = express();

async function loadData(url: string) {
  const paging = 0;
 if(paging) {
   // set some variables
   let page = 1;
   // create empty array where we want to store the objects for each loop
   let stuff = [];
   // create a lastResult array which is going to be used to check if there is a next page
   let lastResult = [];
   do {
     // try catch to catch any errors in the async api call
     try {
       console.log(`${url}&page=${page}`)
       // use node-fetch to make api call
       const resp = await fetch(`${url}&page=${page}`);
       const data = await resp.json();
       lastResult = data;
       console.log(lastResult.next)
       stuff.push(data);
       // increment the page with 1 on each loop
       page++;

     } catch (err) {
       console.error(`Oeps, something is wrong ${err}`);
     }
     // keep running until there's no next page
 //  } while (lastResult.next !== null);
 } while (page <= 1);
   // let's log out our new people array
   console.log(stuff);

   return stuff;
 } else {
    const res = await fetch(url);
    const data = await res.json();
   if (data && data.count && data.results) {
    return data.results;
    }
   console.log(data);
    return data;

 }


}

app.use(
  '/',
  graphqlHTTP(() => {
    const loader = new Dataloader(keys => Promise.all(keys.map(loadData)));

    return {
      schema,
      graphiql: true,
      context: {
        loader,
      },
    };
  })
);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});
