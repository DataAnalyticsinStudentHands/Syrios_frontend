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
import citycoin1 from "../data/economic-images/citycoin1.png";
import citycoin2 from "../data/economic-images/citycoin2.png";

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
        <p data-aos-duration="3000" data-aos="fade-in" id="sub-title">
          a{" "}
          <strong data-aos="fade-in" id="bronze">
            BRONZE
          </strong>{" "}
          coin
        </p>
      </div>

  {/* SECTION 1 */}

      <div className="eco-1-head">
        <p id="eco-style-head" data-aos="fade-up">
          This is a bronze coin.
        </p>
        <img
          src={bronze}
          alt="Logo"
          data-aos="fade-right"
          className="eco-img-head"
        />
      </div>

      <div className="eco-1-1">
        <div style={{width:'600px'}}>
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
        <p data-aos="fade-in" id="eco-style-para">
          A regular person working on a farm or in a shop would earn around 18
          of these bronze coins a day.{" "}
        </p>
      </div>

      <div className="eco-1-2-up">
        <p id="eco-style-para" data-aos="fade-down">
          People needed these coins to buy things in Antioch’s markets.
        </p>
      </div>

      <div className="eco-1-2">
        <div data-aos="fade-in">
          <img src={people} alt="Logo" />
          <p id="captions">
            This painting is based upon the <em>Departure Mosaic</em> from the
            “House of Menander” (mid 3rd century CE), which was excavated at Daphne
            (Antioch’s suburb) and is now at the San Diego Museum of Art.
          </p>
        </div>
        <p id="eco-style-sub" data-aos="fade-in">
          “Antioch, a city known to all the world… so rich is it in imported and
          local goods.”
          <br></br>
          <br></br>
          - <em>Ammianus Marcellinus, Roman Antiquities</em> 14.8.8
        </p>
      </div>

      <div className="eco-1-3">
        <p id="eco-style-para" data-aos="fade-in">
          But this coin wasn’t worth very much, as it was made out of cheap
          bronze and not valuable gold or silver.{" "}
        </p>
        <div style={{width:"800px"}}>
          <img src={bronze_caption} alt="Logo" data-aos="fade-right" className="eco-size-images" />
          <img src={silver_caption} alt="Logo" data-aos="fade-in" className="eco-size-images" />
          <img src={gold_caption} alt="Logo" data-aos="fade-left" className="eco-size-images" />
        </div>
      </div>

      <div className="eco-1-4">
        <div className="flex-column" style={{margin: '60px', width:'600px'}}>
          <div>
            <img
              src={silver}
              alt="Logo"
              id="comp-5-silver-coin"
              data-aos="fade-in"
            />
          </div>
          <br>
          </br>
          <div>
            <img src={equal_to} alt="Logo" data-aos="fade-in" />
          </div>
          <br>
          </br>
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
        <p data-aos="fade-in" style={{width: '400px'}} id="eco-style-para">
          In fact, some scholars think that it might have taken over 100 of
          these bronze coins to equal the value of only 1 silver tetradrachm!
        </p>
      </div>

  {/* SECTION 2 */}

      <div className="eco-2-head">
        <p id="eco-style-head" data-aos="fade-up">
          This coin could still buy important items for a person living in
          Antioch.
        </p>
        <img
          src={bronze}
          alt="Logo"
          data-aos="fade-right"
          className="eco-img-head"
        />
      </div>

      <div className="eco-2-1">
        <div style={{ margin: "50px" }}>
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="750"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1000"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1250"
          />
        </div>
        <p data-aos="fade-in" id="eco-style-para">
          Four bronze coins could buy a loaf of bread.
        </p>
        <img src={bread} alt="Logo" data-aos="fade-left" style={{ margin: "50px" }} />
      </div>

      <div className="eco-2-2-up">
        <p data-aos="fade-in" id="eco-style-para">
          Between 2 and 10 bronze coins could buy 1 quart of wine. Today, that’s
          the same as 2 school milk cartoons.
        </p>
      </div>

      <div className="eco-2-2">
        <div style={{ padding: "10px" }}>
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="700"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="900"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1100"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1300"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1500"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1700"
          />
          <img
            src={bronze}
            alt="Logo"
            id="eco-2-1-bronze"
            data-aos="fade-right"
            data-aos-duration="1900"
          />
        </div>
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

  {/* SECTION 3 */}

      <div className="eco-3-head">
        <p data-aos="fade-up" id="eco-style-head">
          Most of the Antioch civic coins were spent locally.
        </p>
      </div>

      <div className="eco-3-1">
        <p id="eco-style-para" data-aos="fade-down">
          Not all coins stayed in Antioch though.
        </p>
      </div>

      <div className="eco-3-2">
        <p id="eco-style-para" data-aos="fade-left">
          Instead some of the coins moved even hundreds of miles away.
        </p>
      </div>

      <div className="eco-3-3" >
          <p data-aos="fade-in" id="eco-style-sub">
            Click on the map to explore all the places these little bronze civic
            coins have been found through excavation.
          </p>
        <Tableau data-aos="fade-in" />
      </div>

      <div className="eco-3-4" >
        <p data-aos="fade-up" id="eco-style-para">
          This speaks to all the trade routes running in and out of Antioch and
          all the people coming and going from the city with little bronze coins
          in their pockets.
        </p>
      </div>

      <div className="eco-3-5" >
        <p data-aos="fade-right" id="eco-style-para">
          We cannot be sure that the Antiochians’ civic coins were worth money at
          all of these places.
        </p>
      </div>

      <div className="eco-3-6" >
        <div data-aos="flip-right">
          <img
            src={citycoin1}
            alt="Logo"
            className="eco-size-images"
          />
          <p id="eco-style-sub">
            This civic bronze was minted at Laodicea ad Mare, Antioch’s rival.
          </p>
        </div>
        <p data-aos="fade-left" id="eco-style-para">
          Many other cities minted their own civic coins and may have refused to
          accept the Antiochians’ coins in the market.
        </p>
        <div data-aos="flip-left">
          <img
            src={citycoin2}
            alt="Logo"
            className="eco-size-images"
          />
          <p id="eco-style-sub">
            This civic bronze coin was minted at Seleucia Pieria, Antioch’s neighbor.
          </p>
        </div>
      </div>

      <div className="eco-4-1" >
        <p data-aos="fade-up" id="eco-style-para">
          Still, how far away the coins moved speaks to all the trade routes running
          in and out of Antioch and all the people coming and going from the city
          with little bronze coins in their pockets.
        </p>
      </div>

      <div className="eco-4-2">
        <StyledLink to="/tableau-maps" id="eco-intro-style-footer" data-aos="fade-right">
          Where did the civic coins move?
        </StyledLink>
        <StyledLink to="/select-story" id="eco-intro-style-footer" data-aos="fade-left">
          Tell me another story!
        </StyledLink>
      </div>

      <div className="eco-resources">
          <p id="religious-style-rsrc">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507493h.r=Hadrian%20Hadrian?rk=515024;0" target="_blank">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 430</a></li>
                <br></br>
              <li><a href="https://rpc.ashmus.ox.ac.uk/coin/73446" target="_blank">Roman Provincial Coinage Project</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1944.100.39966" target="_blank">American Numismatic Society - 1944.100.39966</a></li>
                <br></br>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b84967440" target="_blank">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, M 5464</a></li>
                <br></br>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8508048m" target="_blank">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Louis de Clercq 280</a></li>

            </ul>
            <br></br>
            <br></br>
            To read more, check these out:
            <br></br>
            <br></br>
            <ul>
              <li>
                Butcher, K. 2002, “Circulation of Bronze Coinage in the Orontes Valley
                in the Late Hellenistic and Early Roman Periods,” in C. Augé and F.
                Duyrat (eds.), Les monnayages syriens: quel apport pour l'histoire du
                Proche-Orient hellénistique et romain?: actes de la table ronde de Damas,
                10-12 novembre 1999. Beirut: Institut Français d''Archéologie du Proche- Orient.
                145-152.
              </li>
                <br></br>
              <li>
                Harl, K.W. 1996. <em>Coinage in the Roman Economy</em>, 300 B.C.
                to A.D. 700. Baltimore: Johns Hopkins University Press.
              </li>
                <br></br>
              <li>
                Scheidel, W., Morris, I. and Saller, R. (eds.), 2007, <em>The Cambridge
                Economic History of the Greco- Roman World. Cambridge University Press</em>.
              </li>
            </ul>
          </p>
      </div>


    </div>
  );
};

export default Economic;
