import React from "react";
// import Attributes from "./items";
// import axios from "axios";
import Data from '../data/items.json'
import './fetch.css'

//? Enable CORS in the header
//? Access-Control-Allow-Origin: 'https://sites.lib.uh.edu/kmneuma2/api/items'

const Syrios = () => {

  return (
    <div className="Syrios" style={{ textAlign: "center", color: "white" }}>
      <div className='Coins'>
        {Data.items.map((data) => 
            <>
            {/* <p>{data.id}</p> */}
            <img src={data.obverse} style={{height: data.diameter*3, width: data.diameter*3}} key={data.id} className='obverse-image' alt={data.alt}/>
            {/* <img src={data.reverse} style={{height: data.diameter*5, width: data.diameter*5}} key={data.id} className='reverse-image' alt={data.alt}/> */}
            </>)}
      </div>
    </div>
  );
};

export default Syrios;





// const [dataJson, setDataJson] = useState([]);

// useEffect(() => {
//   getRecipes();
// }, []);

// const getRecipes = async () => {
//   const response = await fetch(
//     '/Users/FUZION.2.0/Desktop/FindingConnectionsAncientSyria/src/Components/data/items.json'
//   );
//   const data = await response.json();
//   console.log(data);
//   setDataJson(data.items);
// };







 // const [attributes, setAttributes] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(``)
  //     .then((res) => {
  //       console.log(res);
  //       setAttributes(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);