import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

export const Card = (props) => {
  return (
    <div className='coin-card'>
      <Link className="link" to={`/Coin/${props?.id}`}>
          <div className='image'>
            {props?.coin?.obverse_image?.data
              ? <img src={ process.env.REACT_APP_UPLOAD_URL + props?.coin?.obverse_image?.data?.attributes?.url} alt=""/>
              :<img src={ process.env.REACT_APP_UPLOAD_URL + props?.coin?.reverse_image?.data?.attributes?.url}alt=""/>}
          </div>
          <h1>
           {props?.coin?.mint?.data?.attributes?.mint} {props?.coin?.material?.data?.attributes?.material} {props?.coin?.obverse_type.length === 0 ? props?.coin?.reverse_type : props?.coin?.obverse_type} 
          </h1>
          <h2>
            Origin: {props?.coin?.ancient_territory?.data?.attributes?.ancient_territory.length === 0 ? "None" : props?.coin?.ancient_territory?.data?.attributes?.ancient_territory}
            </h2>
          <h2>
            Date:{props?.coin?.from_year < 0 ? <>{String(props?.coin?.from_year).substring(1)} BCE</>:<>{props?.coin?.from_year} CE</>} - {props?.coin?.to_year < 0 ? <>{String(props?.coin?.to_year).substring(1)} BCE</>:<>{props?.coin?.to_year} CE</>}
            </h2>
      </Link>
    </div>
  )
}

export const SpotlightCard = (props) =>{
  return(
    <div className="sportlight-card">
      <Link className="link" to={`/Coin/${props?.coin?.id}`}>
      <div className='image'>
            {props?.coin?.obverse_image?.data
              ? <img src={ process.env.REACT_APP_UPLOAD_URL + props?.coin?.attributes?.obverse_image?.data?.attributes?.url} alt=""/>
              :<img src={ process.env.REACT_APP_UPLOAD_URL + props?.coin?.attributes?.reverse_image?.data?.attributes?.url} alt=""/>}
          </div>
          <h1>{props?.coin?.attributes?.mint?.data?.attributes?.mint} {props?.coin?.attributes?.material?.data?.attributes?.material} {props?.coin?.attributes?.obverse_type.length === 0 ? props?.coin?.attributes?.reverse_type : props?.coin?.attributes?.obverse_type} </h1>
          <h2> Origin: {props?.coin?.attributes?.ancient_territory?.data?.attributes?.ancient_territory.length === 0 ? "None" : props?.coin?.attributes?.ancient_territory?.data?.attributes?.ancient_territory}</h2>
          <h2>Date:{props?.coin?.attributes?.from_year < 0 ? <>{String(props?.coin?.attributes?.from_year).substring(1)} BCE</>:<>{props?.coin?.attributes?.from_year} CE</>} - {props?.coin?.attributes?.to_year < 0 ? <>{String(props?.coin?.attributes?.to_year).substring(1)} BCE</>:<>{props?.coin?.attributes?.to_year} CE</>}</h2>
      </Link>
    </div>
  )
}
