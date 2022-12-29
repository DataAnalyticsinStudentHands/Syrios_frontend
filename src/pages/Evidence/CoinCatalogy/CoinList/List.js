import React from "react";
import "./List.scss";
import { Card } from "./Card";


const List = (props) => {
  return (
    <div className="list">
        {props.coins?.map((coin) =>{
          return <Card coin={coin?.item?.attributes} id={coin?.item?.id} key={coin?.item?.id}/>
        })}
    </div>
  );
};

export default List;
