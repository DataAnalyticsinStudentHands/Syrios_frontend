import React from "react";
// import TableauReport from "tableau-react";
// import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Tableau from "./tableau";
import "tableau-api";
// import TableauReport from 'tableau-react-embed';
import "./economic-story.css";
import AOS from "aos";
import bronze from "../data/economic-images/bronze-coin.png";
import silver from "../data/economic-images/silver-coin.png";
// import gold from "../data/economic-images/gold-coin.png";
import bronze_caption from "../data/economic-images/bronze-coin-caption.png";
import silver_caption from "../data/economic-images/silver-coin-caption.png";
import gold_caption from "../data/economic-images/gold-coin-caption.png";
import people from "../data/economic-images/people.png";
import equal_to from "../data/economic-images/equal-to.png";
import bread from "../data/economic-images/bread.png";
import jug from "../data/economic-images/jug.png";
import milk from "../data/economic-images/milk.png";

const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus, &:visited, &:link, &:active {
        text-decoration: none;
        color: white;
    }
    &:hover {
      color: #faebd7;
    }
`;

const Economic = () => {
  AOS.init({
    duration: 1000,
  });

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
        <img src={bronze} alt="Logo" data-aos="fade-right" className="size-images"/>
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
      <div className="eco-component-3">
        <p id="style-para" data-aos="fade-down">
          People needed these coins to buy things in Antioch’s markets
        </p>
        <img src={people} alt="Logo" data-aos="fade-in" />
        <p id="style-para" data-aos="fade-down">
          “Antioch, a city known to all the world…so rich is it in imported and
          local goods.” <span style={{fontStyle:'italic'}}>Ammianus Marcellinus, Roman Antiquities</span> 14.8.8{" "}
        </p>
      </div>
      <div className="eco-component-4">
        <p id="style-para" data-aos="fade-in">
          But this coin wasn’t worth very much, as it was made out of cheap
          bronze and not valuable gold or silver.{" "}
        </p>
        <div>
          <img src={bronze_caption} alt="Logo" data-aos="fade-right" />
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
            <img
              src={silver}
              alt="Logo"
              id="comp-5-silver-coin"
              data-aos="fade-in"
            />
          </div>
          <div>
            <img src={equal_to} alt="Logo" data-aos="fade-in" />
          </div>
          <div>
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="100"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="200"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="300"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="400"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="600"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="800"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
          </div>
        </div>
      </div>
      <div className="eco-component-6">
        <img
          src={bronze}
          alt="Logo"
          style={{ padding: "10px" }}
          data-aos="fade-right"
        />
        <p id="style-para" data-aos="fade-left">
          This coin could still buy important items for a person living in
          Antioch.
        </p>
      </div>
      <div className="eco-component-7">
        <div style={{ padding: "10px" }}>
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="750"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1000"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1250"
          />
        </div>
        <p id="style-para" data-aos="fade-in">
          Four bronze coins could buy a loaf of bread.
        </p>
        <img src={bread} alt="Logo" data-aos="fade-left" />
      </div>
      <div className="eco-component-8">
        <div style={{ padding: "10px" }}>
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="700"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="900"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1100"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1300"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1700"
          />
          <img
            src={bronze}
            alt="Logo"
            id="comp-7-bronze"
            data-aos="fade-right"
            data-aos-duration="1900"
          />
        </div>
        <p id="style-para" data-aos="fade-in">
          Between 2 and 10 bronze coins could buy 1 quart of wine. Today, that’s
          the same as 2 school milk cartoons.
        </p>
        <img
          src={jug}
          alt="Logo"
          data-aos="fade-left"
          data-aos-duration="800"
        />
        <img
          src={milk}
          alt="Logo"
          data-aos="fade-left"
          data-aos-duration="1000"
        />
        <img
          src={milk}
          alt="Logo"
          data-aos="fade-left"
          data-aos-duration="1200"
        />
      </div>
      <div className="eco-component-9">
        <p id="style-para" data-aos="fade-up">
          Most of the Antioch civic coins were spent locally.
        </p>
      </div>
      <div className="eco-component-10" >
        <p id="style-para" data-aos="fade-up">
          Not all coins stayed in Antioch though. Instead some of the coins
          moved even hundreds of miles away.
        </p>
      </div>
      <div className="eco-component-11" >
        <Tableau data-aos="fade-in"/>
      </div>
      <div className="eco-component-12">
        <p data-aos="fade-down">
          This speaks to all the trade routes running in and out of Antioch and
          all the people coming and going from the city with little bronze coins in their pockets.
        </p>
      </div>
      <div className="eco-component-13">
        <StyledLink to="/tableau-maps" id="eco-intro-style-footer">
          Where did the civic coins move?
        </StyledLink>
        <StyledLink to="/select-story" id="eco-intro-style-footer">
          Tell me another story!
        </StyledLink>
      </div>
    </div>
  );
};

export default Economic;
