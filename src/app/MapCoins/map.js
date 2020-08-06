import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./map.css";
import AOS from "aos";
import TableauReport from 'tableau-react';
import seleucidTetradrachm from "../data/mapcoins-images/seleucidTetradrachm.png";
import romanAureus from "../data/mapcoins-images/romanAureus.png";
import usQuarter from "../data/mapcoins-images/usQuarter.png";
import euro from "../data/mapcoins-images/euro.png";
import syrianProvincial from "../data/mapcoins-images/syrianProvincial.png";
import egyptianTetradrachm from "../data/mapcoins-images/egyptianTetradrachm.png";
import usStateQuarter from "../data/mapcoins-images/usStateQuarter.png";
import germanPfennig from "../data/mapcoins-images/germanPfennig.png";
import zeugmaCoin from "../data/mapcoins-images/zeugmaCoin.png";
import nycFinal from "../data/mapcoins-images/nycFinal.png";
import parisCoin from "../data/mapcoins-images/parisCoin.png";
import maps from "../data/mapcoins-images/maps.png";
import circulationMap from "../data/mapcoins-images/circulationMap.png";

const CoinsExcavations = props => (
  <TableauReport
    url="https://public.tableau.com/views/AntiochCoinswithinExcavationSites/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

const Coins = props => (
  <TableauReport
    url="https://public.tableau.com/views/HoardswithAntiochCoins/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

const Excavations = props => (
  <TableauReport
    url="https://public.tableau.com/views/AntiochExcavations/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

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

const Roman = () => {
  AOS.init({
    duration: 1000,
    offset: -25,
  });

  return (
    <div className="class-maps">
      <div className="class-maps-story">
        <div className="class-maps-title">
          <p data-aos="slide-right">Let Me</p>
          <h1 data-aos="slide-left" id="green">
            Map
          </h1>
          <p data-aos="slide-up">Coins</p>
        </div>
      </div>

{/* SECTION 1 */}

      <div className="maps-1-head">
        <p id="maps-head" data-aos="fade-up">
          During the time of the Greeks and Romans, many different governments
          minted their own coins.
        </p>
      </div>

      <div className="maps-1-1">
        <div data-aos="flip-right">
          <img
            src={seleucidTetradrachm}
            alt="Logo"
            className="maps-img-sm"
          />
          <img
            src={romanAureus}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            A royal Seleucid tetradrachm and an imperial Roman aureus.
          </p>
        </div>
        <p data-aos="fade-in" id="maps-para">
          Some of these coins were for kings and emperors. These are like our federal
          U.S. coins or the European Union coins.
        </p>
        <div data-aos="flip-left">
          <img
            src={usQuarter}
            alt="Logo"
            className="maps-img-sm"
          />
          <img
            src={euro}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            A U.S. quarter and a 1 Euro coin.
          </p>
        </div>
      </div>

      <div className="maps-1-2">
        <div data-aos="flip-right">
          <img
            src={syrianProvincial}
            alt="Logo"
            className="maps-img-sm"
          />
          <img
            src={egyptianTetradrachm}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            A Syrian provincial coin and an Egyptian tetradrachm.
          </p>
        </div>
        <p data-aos="fade-in" id="maps-para">
          Other coins were for provinces or regions. This would be like if the U.S.
          states minted their own coins or like the individual country coins continuing
          their coins within the Euro currency system.
        </p>
        <div data-aos="flip-left">
          <img
            src={usStateQuarter}
            alt="Logo"
            className="maps-img-sm"
          />
          <img
            src={germanPfennig}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            A U.S. state quarter and a 10 German pfennig.
          </p>
        </div>
      </div>

      <div className="maps-1-3">
        <div data-aos="flip-right">
          <img
            src={zeugmaCoin}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            Civic coins from Antioch and Zeugma in Syria.
          </p>
        </div>
        <p data-aos="fade-in" id="maps-para">
          If that wasn’t enough, many individual cities and peoples in the wider
          Middle East also minted their own coins. These coins celebrated local
          histories and identities with diverse images and bilingual inscriptions.
          This is like if New York or Chicago or Paris or London minted their own coins.
        </p>
        <div data-aos="flip-left">
          <img
            src={nycFinal}
            alt="Logo"
            className="maps-img-sm"
          />
          <img
            src={parisCoin}
            alt="Logo"
            className="maps-img-sm"
          />
          <p id="maps-sub">
            Imagined civic coins from New York and Paris.
          </p>
        </div>
      </div>

      <div className="maps-1-4">
        <p data-aos="fade-right" id="maps-para">
          This local minting continued and was even encouraged after whole regions
          were absorbed into the larger empires of the Hellenistic and Roman states.
        </p>
        <img
          src={maps}
          alt="Logo"
          data-aos="fade-left"
        />
      </div>

      <div className="maps-2-head">
        <p id="maps-head" data-aos="fade-up">
          Just because all these coins were minted in the same empire did not mean
          that they had equal value
        </p>
      </div>

      <div className="maps-2-1">
        <p data-aos="fade-in" id="maps-para">
          Because of the uniqueness of each coin and the issuing authority that
          guaranteed its value (e.g., individual cities, provinces, kingdoms,
          imperial governments), not all coins were accepted everywhere as currency.
        </p>
        <div>
          <img
            src={circulationMap}
            alt="Logo"
            data-aos="fade-in"
          />
          <p data-aos="fade-in" id="maps-sub">
            This map shows how the coins of different authorities are believed to
            have generally circulated. Actual evidence, however, shows tremendous 
            variation.
          </p>
        </div>
      </div>

      <div className="maps-component-1">
        <p id="maps-style-select-items" data-aos="fade-in">Antioch Coins with Excavations Sites</p>
        <CoinsExcavations data-aos="fade-in"/>
      </div>
      <div className="maps-component-2">
        <p id="maps-style-select-items" data-aos="fade-in">Hoards with Antioch Coins</p>
        <Coins data-aos="fade-in"/>
      </div>
      <div className="maps-component-3">
        <p id="maps-style-select-items">Antioch Excavations</p>
        <Excavations />
      </div>
    </div>

  );
};

export default Roman;
