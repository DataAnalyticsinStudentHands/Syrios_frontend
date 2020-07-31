import React, { useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import GraphQLids from './ids';

const GraphQLClient = () => {

  const client = new ApolloClient({
    uri: "http://localhost:3002/graphql",
  });

  return (
    <div>
      <ApolloProvider client={client}>
        <div>
          <h2>Syrios Omeka Import 🚀</h2>
          <p>---------------------</p>
          <GraphQLids />
          {/* <CoinList numbers={coinList} /> */}
          {/* <Coin /> */}
        </div>
      </ApolloProvider>
    </div>
  );
};

export default GraphQLClient;

// const PushCoin = (id) => {
//   setCoinList(coinList.concat(id));
//   // console.log(coinList.map((x) => x.id));
// };

// function CoinList(props) {
//   const numbers = props.numbers;
//   const listItems = numbers.map((number) => <li>{number}</li>);
//   return <ul>{listItems}</ul>;
// }
