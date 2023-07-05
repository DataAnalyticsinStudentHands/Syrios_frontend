import React from "react";
import "./List.scss";
import { Card } from "./Card";


const List = (props) => {
  return (
    <div className="list">
        {props.coins?.map((coin) =>{
          return <Card coin={coin?.attributes} id={coin?.id} key={coin?.id}/>
        })}
    </div>
  );
};

export default List;
