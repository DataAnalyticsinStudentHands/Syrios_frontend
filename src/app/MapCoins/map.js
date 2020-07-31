import React from "react";
import "./map.css"
import TableauReport from 'tableau-react';

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

const Roman = () => {
  return (
    <div className="class-maps">
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
