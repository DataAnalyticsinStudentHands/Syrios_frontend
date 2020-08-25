import React, { useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
// import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const GQL_Client = () => {
  const client = new ApolloClient({
    uri: "http://localhost:3002/graphql",
  });

  const GET_COINS = gql`
    {
      coins {
        obverseFile
        reverseFile
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_COINS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;

  return data.coins.map(({ id, obverseFile, reverseFile }) => (
    <div key={id} className="class-graphql">
      <img src={obverseFile} alt={id} />
      {/* <img src={reverseFile} alt={id} />   */}
    </div>
  ));
};

export default GQL_Client;
