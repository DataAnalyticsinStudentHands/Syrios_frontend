export function CoinDetails({ id }) {
  const { loading, error, data } = useQuery(GET_COIN, {
    variables: { id },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return console.log(data.coin.id);
  // <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
}
