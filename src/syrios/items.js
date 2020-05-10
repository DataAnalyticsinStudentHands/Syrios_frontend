import React from "react";

const Attributes = ({ id, url, added }) => {
  return (
    <div className="Attributes">
      <ul>
        <li>
          Name: {id} | Email: {url} | Added : {added}
        </li>
      </ul>
    </div>
  );
};

export default Attributes;
