import React, { useState } from "react";
import ApolloClient, { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
// import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const GraphQLids = () => {
  const client = new ApolloClient({
    uri: "http://localhost:3002/graphql",
  });

  const GET_IDS = gql`
    {
      syrioscoins {
        id
        element_texts
        obverse{
          file_urls{
            original
          }
        }
        reverse{
          file_urls{
            original
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_IDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( ${error.message}</p>;

  return data.syrioscoins.map(({ id, element_texts, obverse, reverse }) => (
    <div key={id}>
      <p>---------------------</p>
      <p>id: {id}</p>
      <p>{element_texts.map(function (item) {         // comment this if socket hangs up
        return <div>{item.text}</div>     
      })}</p>
      <img src={obverse.file_urls.original} alt={id}/>       {/* comment this if socket hangs up */}
      <img src={reverse.file_urls.original} alt={id}/>        {/* comment this if socket hangs up */}
    </div>   
  ));
};

export default GraphQLids;


