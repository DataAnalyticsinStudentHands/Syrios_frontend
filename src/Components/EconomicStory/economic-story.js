import React, { useEffect, useState } from "react";
import 'tableau-api';
// import TableauReport from 'tableau-react-embed';
import "./economic-story.css";
import AOS from "aos";
import bronze from "../data/economic-images/bronze-coin.png";
import silver from "../data/economic-images/silver-coin.png";
import gold from "../data/economic-images/gold-coin.png";
import bronze_caption from "../data/economic-images/bronze-coin-caption.png";
import silver_caption from "../data/economic-images/silver-coin-caption.png";
import gold_caption from "../data/economic-images/gold-coin-caption.png";
import people from "../data/economic-images/people.png";
import equal_to from "../data/economic-images/equal-to.png";
import bread from "../data/economic-images/bread.png"
import jug from "../data/economic-images/jug.png"
import milk from "../data/economic-images/milk.png"


const Economic = () => {
  AOS.init({
    duration: 1000,
  });

  // const [setInitViz] = useState([]);

  // useEffect(() => {
  //   getInitViz();
  // });

  // const getInitViz = () => {
  //   const vizUrl =
  //     "https://public.tableau.com/shared/X6RK47F4G?:display_count=n&:origin=viz_share_link";
  //   const vizContainer = this.vizContainer;
  //   let tableau = new window.tableau.Viz(setInitViz, vizUrl);
  // };

  return (
    <div className="class-eco-story">
      <div className="class-eco-title">
        <p data-aos="slide-right">The</p>
        <h1 data-aos="slide-left" id="green">
          Economic
        </h1>
        <p data-aos="slide-up">Story</p>
        <p data-aos-duration="4000" data-aos="fade-in" id="sub-title">
          a{" "}
          <strong data-aos="fade-in" id="bronze">
            BRONZE
          </strong>{" "}
          coin
        </p>
      </div>
      <div className="eco-component-1">
        <img src={bronze} alt="Logo" data-aos="fade-right" />
        <p data-aos="fade-left" id="style-para">
          This is a bronze coin
        </p>
      </div>
      <div className="eco-component-2">
        <div className="eco-component-2-images" style={{ width: "800px" }}>
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1100"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1200"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1300"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1400"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1500"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1600"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1700"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1800"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1900"
          />
          <br></br>
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2000"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2100"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2200"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2300"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2400"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2500"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2600"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2700"
          />
          <img
            src={bronze}
            alt="Logo"
            data-aos="fade-down"
            data-aos-duration="2800"
          />
        </div>
        <p id="style-para" data-aos="fade-in">
          A regular person working on a farm or in a shop would earn around 18
          of these bronze coins a day.{" "}
        </p>
      </div>
      <div className="eco-component-3" >
        <p id="style-para" data-aos="fade-down">
          People needed these coins to buy things in Antioch’s markets
        </p>
        <img src={people} alt="Logo" data-aos="fade-in"/>
        <p id="style-para">
          “Antioch, a city known to all the world…so rich is it in imported and
          local goods.” Ammianus Marcellinus, Roman Antiquities 14.8.8{" "}
        </p>
      </div>
      <div className="eco-component-4">
        <p id="style-para" data-aos="fade-in">
          But this coin wasn’t worth very much, as it was made out of cheap
          bronze and not valuable gold or silver.{" "}
        </p>
        <div>
          <img src={bronze_caption} alt="Logo" data-aos="fade-right"/>
          <img src={silver_caption} alt="Logo" data-aos="fade-in" />
          <img src={gold_caption} alt="Logo" data-aos="fade-left" />
        </div>
      </div>
      <div className="eco-component-5">
        <p id="style-para" data-aos="fade-in">
          In fact, some scholars think that it might have taken over 100 of
          these bronze coins to equal the value of only 1 silver tetradrachm!{" "}
        </p>
        <div className="flex-column">
          <div>
            <img src={silver} alt="Logo" id="comp-5-silver-coin" data-aos="fade-in"/>
          </div>
          <div>
            <img src={equal_to} alt="Logo" data-aos="fade-in"/>
          </div>
          <div>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="100"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="200"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="300"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="400"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="500"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="600"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="700"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="800"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="900"/>
            <img src={bronze} alt="Logo" data-aos="fade-right" data-aos-duration="1000"/>
            
          </div>
        </div>
      </div>
      <div className="eco-component-6">
        <img src={bronze} alt="Logo" style={{padding:'10px'}}/>
        <p id="style-para">
            This coin could still buy important items for a person living in Antioch.  
        </p>
      </div>
      <div className="eco-component-7">
        <div style={{padding:'10px'}}>
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
        </div>
        <p id="style-para">
          Four bronze coins could buy a loaf of bread. 
        </p>
        <img src={bread} alt="Logo" />
      </div>
      <div className="eco-component-8">
        <div style={{padding:'10px'}}>
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
            <img src={bronze} alt="Logo" id="comp-7-bronze" />
        </div>
        <p id="style-para">
            Between 2 and 10 bronze coins could buy 1 quart of wine. Today, that’s the same as 2 school milk cartoons.
        </p>
        <img src={jug} alt="Logo" />
        <img src={milk} alt="Logo" />
      </div>
      <div className="eco-component-9">
        <p id="style-para">
            Most of the Antioch civic coins were spent locally.
        </p>
      </div>
      {/* <div className='eco-component-10'>
        <iframe><div ref={(tableau) => {setInitViz = tableau}}></div></iframe>
        
      </div>  */}
    </div>
  );
};

export default Economic;