/* @flow */

import { GQC } from 'graphql-compose';
import CoinTC from './Coin';

GQC.rootQuery().addFields({
  coin: CoinTC.getResolver('findById'),
  items: CoinTC.getResolver('findListByPageNumber'),
  syrioscoins: CoinTC.getResolver('findListByCollectionNumber'),
});

const schema = GQC.buildSchema();

export default schema;
