import React from "react";

const Attributes = ({ id, diameter, image }) => {
  return (
    <div className="Attributes">
      <h1>{id}</h1>
      <p>{diameter}</p>
      <img src={image} alt=""/>
    </div>
  );
};

export default Attributes;
