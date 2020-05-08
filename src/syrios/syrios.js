import React, { Component } from "react";
// import dataJson from "../data/items.json";

//? Enable CORS in the header
//? Access-Control-Allow-Origin: 'https://sites.lib.uh.edu/kmneuma2/api/items'

class Syrios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch("https://sites.lib.uh.edu/kmneuma2/api/items")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          items: json,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded) return <div>Loading...</div>;

    return (
      <div className="App">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              Name: {item.id} | Email: {item.url} | Added : {item.added}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default Syrios;