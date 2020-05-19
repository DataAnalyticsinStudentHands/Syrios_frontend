import React, { useEffect, useState } from "react";
import Attributes from "./items";
import axios from "axios";
// import dataJson from "../data/items.json";

//? Enable CORS in the header
//? Access-Control-Allow-Origin: 'https://sites.lib.uh.edu/kmneuma2/api/items'

const Syrios = () => {
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    axios
      .get(`https://sites.lib.uh.edu/kmneuma2/api/items`)
      .then((res) => {
        console.log(res);
        setAttributes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App" style={{textAlign:'center', color: 'white'}}>
      <h1> This is a Story to tell!</h1>
      <ul>
        {attributes.map((item) => (
          <Attributes id={item.id} url={item.url} added={item.added} />
        ))}
      </ul>
    </div>
  );
};

export default Syrios;