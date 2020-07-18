import React from "react";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "http://localhost:3002/graphql",
});

const Coin = () => {
  const { loading, error, data } = useQuery(gql`
    {
      coin(id: 1415) {
        id
        obverse {
          file_urls {
            original
          }
        }
        reverse {
          file_urls {
            original
          }
        }
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>{data.coin.id}</p>
      <img src={data.coin.obverse.file_urls.original} />
      <img src={data.coin.reverse.file_urls.original} />
    </div>
  );
};

const Region = () => {
  const { loading, error, data } = useQuery(gql`
    {
      coin(id: 1415) {
        element_texts
      }
    }
  `);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  const dat = data.coin.element_texts.map(({element, text}) => {
    if (element.name == 'Region') return <p>Region: {text}</p>;
    if (element.name == 'Mint') return <p>Mint: {text}</p>;
    if (element.name == 'State') return <p>State: {text}</p>;
    if (element.name == 'Authority') return <p>Authority: {text}</p>;
    if (element.name == 'Issuer') return <p>Issuer: {text}</p>;
    if (element.name == 'Date') return <p>Date: {text}</p>;
    if (element.name == 'Material') return <p>Material: {text}</p>;
    if (element.name == 'Denomination') return <p>Denomination: {text}</p>;
    if (element.name == 'Obverse Type') return <p>Obverse Type: {text}</p>;
    if (element.name == 'Reverse Type') return <p>Reverse Type: {text}</p>;
    if (element.name == 'Obverse Legend') return <p>Obverse Legend: {text}</p>;
    if (element.name == 'Reverse Legend') return <p>Reverse Legend: {text}</p>;
    if (element.name == 'Bibliography') return <p>Bibliography: {text}</p>;
    if (element.name == 'Title') return <p>Title: {text}</p>;
    if (element.name == 'From Date') return <p>From Date: {text}</p>;
    if (element.name == 'To Date') return <p>To Date: {text}</p>;
    if (element.name == 'ObverseType') return <p>ObverseType: {text}</p>;
    if (element.name == 'Image') return <p>Image: {text}</p>;
    if (element.name == 'Source Image') return <p>Source Image: {text}</p>;
    if (element.name == 'Rights Holder') return <p>Rights Holder: {text}</p>;
    if (element.name == 'Type Category') return <p>Type Category: {text}</p>;
    if (element.name == 'Issuing Authority') return <p>Issuing Authority: {text}</p>;
    if (element.name == 'Diameter') return <p>Diameter: {text}</p>;
    }
  );
  
  return dat;
};


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
          {/* <ID /> */}
          <Region />
          <Coin />
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
