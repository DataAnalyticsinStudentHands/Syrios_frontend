/* @flow */

import fetch from 'node-fetch';
import composeWithJson from 'graphql-compose-json';
import {
  createFindByIdResolver,
  createFindListByCollectionNumberResolver,
  createFindListByPageNumberResolver,
  createFindByUrlListResolver,
} from '../utils';
import FilesTC from './Files';

const restApiResponse = {
  "id": 1095,
  "url": "https://sites.lib.uh.edu/kmneuma2/api/items/1095",
  "public": true,
  "featured": false,
  "added": "2018-12-15T02:26:04+00:00",
  "modified": "2020-05-08T03:48:37+00:00",
  "item_type": {
    "id": 22,
    "url": "https://sites.lib.uh.edu/kmneuma2/api/item_types/22",
    "name": "Coin Type",
    "resource": "item_types"
  },
  "collection": {
    "id": 3,
    "url": "https://sites.lib.uh.edu/kmneuma2/api/collections/3",
    "resource": "collections"
  },
  "owner": {
    "id": 13,
    "url": "https://sites.lib.uh.edu/kmneuma2/api/users/13",
    "resource": "users"
  },
  "files": {
    "count": 2,
    "url": "https://sites.lib.uh.edu/kmneuma2/api/files?item=1095",
    "resource": "files"
  },
  "tags": [],
  "element_texts": [
    {
      "html": false,
      "text": "Antioch Silver Coin of Demetrius I",
      "element_set": {
        "id": 1,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/1",
        "name": "Dublin Core",
        "resource": "element_sets"
      },
      "element": {
        "id": 50,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/50",
        "name": "Title",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Syria",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 112,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/112",
        "name": "Region",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Antioch",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 113,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/113",
        "name": "Mint",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Seleucid",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 114,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/114",
        "name": "State",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Demetrius I",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 115,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/115",
        "name": "Authority",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Central",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 116,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/116",
        "name": "Issuer",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "c. 162 BCE-150 BCE",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 117,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/117",
        "name": "Date",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "-162",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 118,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/118",
        "name": "From Date",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "-150",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 119,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/119",
        "name": "To Date",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "AR (silver)",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 120,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/120",
        "name": "Material",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "tetradrachms",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 121,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/121",
        "name": "Denomination",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Demetrius I",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 127,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/127",
        "name": "ObverseType",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "None",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 123,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/123",
        "name": "Obverse Legend",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Tyche holding sceptre and cornucopia",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 100,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/100",
        "name": "Reverse Type",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "u0392u0391u03a3u0399u039bu0395u03a9u03a3 u0394u0397u039cu0397u03a4u03a1u0399u039fu03a5",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 124,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/124",
        "name": "Reverse Legend",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Seleucid Coins II.1, no. 1633-4",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 36,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/36",
        "name": "Bibliography",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Yes",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 101,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/101",
        "name": "Image",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "http://numismatics.org/collection/1950.84.7?lang=en",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 125,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/125",
        "name": "Source Image",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "American Numsimatic Society - 1950.84.7",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 126,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/126",
        "name": "Rights Holder",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "ruler, god, object",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 129,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/129",
        "name": "Type Category",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "Central",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 130,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/130",
        "name": "Issuing Authority",
        "resource": "elements"
      }
    },
    {
      "html": false,
      "text": "29",
      "element_set": {
        "id": 3,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/element_sets/3",
        "name": "Item Type Metadata",
        "resource": "element_sets"
      },
      "element": {
        "id": 132,
        "url": "https://sites.lib.uh.edu/kmneuma2/api/elements/132",
        "name": "Diameter",
        "resource": "elements"
      }
    }
  ],
  "extended_resources": {
    "exhibit_pages": {
      "count": 0,
      "url": "https://sites.lib.uh.edu/kmneuma2/api/exhibit_pages?item=1095",
      "resource": "exhibit_pages"
    }
  }
};

const CoinTC = composeWithJson('Coin', restApiResponse);

export default CoinTC;

createFindByIdResolver(CoinTC, 'items');
createFindListByCollectionNumberResolver(CoinTC, 'items');
createFindListByPageNumberResolver(CoinTC, 'items');

// currently not used
// CoinTC.addResolver({
//   name: 'findByUrl',
//   type: CoinTC,
//   resolve: async rp => {
//     const res = await fetch(rp.args.url);
//     const data = await res.json();
//     return data;
//   },
// });

CoinTC.addRelation('obverse', {
   resolver: () => FilesTC.getResolver('findObverseByUrl'),
   prepareArgs: {
     url: source => source.files.url,
   },
});

CoinTC.addRelation('reverse', {
  resolver: () => FilesTC.getResolver('findReverseByUrl'),
  prepareArgs: {
    url: source => source.files.url,
  },
});



