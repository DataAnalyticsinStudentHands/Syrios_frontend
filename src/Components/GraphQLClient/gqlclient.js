import React from "react";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
});

const CoinMap = () => {
  const { loading, error, data } = useQuery(gql`
    {
      syrioscoins {
        id
        url
        featured
        added
        modified
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.syrioscoins.map(({ id, url, featured, added, modified }) => (
    <div key={id}>
      <p>---------------------</p>
      <p>id: {id}</p>
      <p>url: {url}</p>
      <p>featured: {featured}</p>
      <p>added: {added}</p>
      <p>modified: {modified}</p>
    </div>
  ));
};

const ItemType = () => {
  const { loading, error, data } = useQuery(gql`
    {
      syrioscoins {
        item_type {
          id
          url
          name
          resource
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.syrioscoins.map(({ item_type }) => (
    <div key={item_type.id}>
      <p>---------------------</p>
      <p>id: {item_type.id}</p>
      <p>url: {item_type.url}</p>
      <p>name: {item_type.name}</p>
      <p>resource: {item_type.resource}</p>
    </div>
  ));
};

const Collection = () => {
  const { loading, error, data } = useQuery(gql`
    {
      syrioscoins {
        collection {
          id
          url
          resource
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.syrioscoins.map(({ collection }) => (
    <div key={collection.id}>
      <p>---------------------</p>
      <p>id: {collection.id}</p>
      <p>url: {collection.url}</p>
      <p>resource: {collection.resource}</p>
    </div>
  ));
};

const Owner = () => {
  const { loading, error, data } = useQuery(gql`
    {
      syrioscoins {
        owner {
          id
          url
          resource
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.syrioscoins.map(({ owner }) => (
    <div key={owner.id}>
      <p>---------------------</p>
      <p>id: {owner.id}</p>
      <p>url: {owner.url}</p>
      <p>resource: {owner.resource}</p>
    </div>
  ));
};

const CoinFiles = () => {
  const { loading, error, data } = useQuery(gql`
    {
      syrioscoins {
        files {
          count
          url
          resource
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.syrioscoins.map(({ files }) => (
    <div key={files.url}>
      <p>---------------------</p>
      <p>count: {files.count}</p>
      <p>url: {files.url}</p>
      <p>resource: {files.resource}</p>
    </div>
  ));
};

const GraphQLClient = () => {
  return (
    <div>
      <ApolloProvider client={client}>
        <div>
          <h2>Syrios Omeka Import 🚀</h2>
          <p>---------------------</p>
          <h3>Contains ID, URL, Featured, Added, Modified</h3>
          <CoinMap />
          <p>---------------------</p>
          <h3>Contains Item Type</h3>
          <ItemType />
          <p>---------------------</p>
          <h3>Contains Collection</h3>
          <Collection />
          <p>---------------------</p>
          <h3>Contains Owner</h3>
          <Owner />
          <p>---------------------</p>
          <h3>Contains Coin Files</h3>
          <CoinFiles />
        </div>
      </ApolloProvider>
    </div>
  );
};

export default GraphQLClient;
