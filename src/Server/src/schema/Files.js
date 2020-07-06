/* @flow */

import composeWithJson from 'graphql-compose-json';
import {
  createFindByIdResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from '../utils';
import fetch from "node-fetch";
import CoinTC from "./Coin";

const restApiResponse =
  {
    "id": 1367,
    "url": "https://sites.lib.uh.edu/kmneuma2/api/files/1367",
    "file_urls": {
      "original": "https://sites.lib.uh.edu/kmneuma2/files/original/7b9d83483f17c053bdd9226b607154e1.png",
      "fullsize": "https://sites.lib.uh.edu/kmneuma2/files/fullsize/7b9d83483f17c053bdd9226b607154e1.jpg",
      "thumbnail": "https://sites.lib.uh.edu/kmneuma2/files/thumbnails/7b9d83483f17c053bdd9226b607154e1.jpg",
      "square_thumbnail": "https://sites.lib.uh.edu/kmneuma2/files/square_thumbnails/7b9d83483f17c053bdd9226b607154e1.jpg"
    },
    "added": "2020-01-11T03:47:04+00:00",
    "modified": "2020-01-11T03:47:05+00:00",
    "filename": "7b9d83483f17c053bdd9226b607154e1.png",
    "authentication": "f8fe603d47d23e111afff2dff5b4020d",
    "has_derivative_image": true,
    "mime_type": "image/png",
    "order": null,
    "original_filename": "SC 1633 obv.png",
    "size": 681515,
    "stored": true,
    "type_os": "PNG image data, 600 x 601, 8-bit/color RGBA, non-interlaced",
    "item": {
      "id": 1095,
      "url": "https://sites.lib.uh.edu/kmneuma2/api/items/1095",
      "resource": "items"
    },
    "element_texts": [],
    "extended_resources": []
  };

const FilesTC = composeWithJson('Files', restApiResponse);

export default FilesTC;

createFindByIdResolver(FilesTC, 'files');
createFindListByPageNumberResolver(FilesTC, 'files');


FilesTC.addResolver( {
  name: 'findObverseByUrl',
  type: FilesTC,
  resolve: async rp => {
      const res = await fetch(rp.args.url);
      const data = await res.json();
      return data[0];
      //return rp.context.loader.loadMany(data);
  },
});

FilesTC.addResolver( {
    name: 'findReverseByUrl',
    type: FilesTC,
    resolve: async rp => {
        const res = await fetch(rp.args.url);
        const data = await res.json();
        return data[1];
        //return rp.context.loader.loadMany(data);
    },
});

// FilesTC.addRelation('characters', {
//   resolver: () => PersonTC.getResolver('findByUrlList'),
//   prepareArgs: {
//     urls: source => source.characters,
//   },
// });




