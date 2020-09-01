import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import GraphQLClient from './graphql-client';


const CoinPile = () => {

  const client = new ApolloClient({
    uri: "http://localhost:3002/graphql",
  });

  return (
    <div>
      <ApolloProvider client={client}>
        <div>
          <GraphQLClient />
        </div>
      </ApolloProvider>
    </div>
  );
};

export default CoinPile;