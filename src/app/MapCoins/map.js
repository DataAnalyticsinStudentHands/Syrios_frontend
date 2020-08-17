import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./map.css";
import AOS from "aos";
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

      <div className="maps-1-1">
        <p data-aos="fade-in" id="maps-intro">
          Examining the distribution of coins within the archaeological record
          offers an important perspective into ancient Syria. The evolving patterns
          over time of where and in what quantities these different coins moved
          help testify to the activities, policies, and relationships of the
          different peoples issuing and using them.
        </p>
      </div>

      <div className="maps-1-2">
        <p data-aos="fade-in" id="maps-intro">
          One way of studying the data is as raw quantities, which tells us about
          the presence and absence of specific coins in a particular location.
          However, if we want to understand the significance of these finds, it
          can help to examine the percentages in which they appear compared to all
          the other coins discovered on site. No hard and fast rules exist as to
          the percentage proving a coin circulated as currency, but we can still
          develop informed conclusions through the context of site histories and
          larger patterns. Additionally, it is important to pay attention to outliers
          or abnormalities and what they may suggest about the movement of people.
        </p>
      </div>

      <div className="maps-1-3">
        <p data-aos="fade-in" id="maps-intro">
          In the study of Antioch, we have a wealth of research opportunities:
          <ul>
            <li>Because the mint produced coins for several different governmental authorities – civic, provincial, and royal/imperial – we can test how a political guarantee affected a coin’s movement and circulation.</li>
            <li>Because the mint produced coins of different metals – gold, silver, bronze – we can test how a coin’s inherent value affected its movement and circulation.</li>
            <li>Because the mint produced coins for over 700 years – from 300 BCE past 450 CE – we can test out the difference time makes on a coin’s movement and circulation.</li>
          </ul>
        </p>
      </div>

      <div className="maps-1-4">
        <p data-aos="fade-in" id="maps-para">
          This map displays the origins of coins excavated at Antioch. Notice how
          the majority of the coins were minted locally, which may suggest a local
          preference or even regulation of circulating currency. Still, coins
          traveled to Antioch from as far away as Rome and Seleucia on the Tigris.
        </p>
      </div>

      <div className="maps-1-5">
        <div>
          <Excavations data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon 10,000+ coins dating between 330 BCE
            and 450 CE and excavted at Antioch. The coin catalog was published by
            D. Waagé in <em>Antioch-on-the-Orontes IV.2: Greek, Roman, Byzantine, and
            Crusader Coins</em> (Princeton University Press, 1952). Click here to
            download this data [make this into a hyperlink to download dataset]
          </p>
        </div>
      </div>

      <div className="maps-1-6">
        <p data-aos="fade-in" id="maps-para">
          This map displays the distribution of coins minted at Antioch and
          discovered as single finds within official excavations. Explore how a
          coin’s attributes – like metal, minting period, or issuing authority –
          or external factors – like distance or political borders – can change
          how a coin moved over space and time.
        </p>
      </div>

      <div className="maps-1-7">
        <div>
          <CoinsExcavations data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon c. 100,000 coin finds published in
            80 excavation reports. See Appendix 2 in Neumann, K. forthcoming.
            <em> Antioch in Syria: A History from Coins, 300 BCE-450 CE </em>
            (Cambridge University Press).
          </p>
        </div>
      </div>

      <div className="maps-1-8">
        <p data-aos="fade-in" id="maps-para">
          This map displays the distribution of silver and gold coins minted at
          Antioch and discovered within a <span id="term">hoard</span> – a cache
          or collection of multiple coins in a single location. Silver and gold
          coins can be rare finds on an archaeological site, because people would
          look for them if dropped. Hoards, however, are often created when a
          person intentionally tries to hides valuable coins either as savings or
          in times of emergency.
        </p>
      </div>

      <div className="maps-1-9">
        <div>
          <Coins data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon c. 215,000 coin finds published in
            300+ coin reports. See Appendix 3 in Neumann, K. forthcoming.
            <em> Antioch in Syria: A History from Coins, 300 BCE-450 CE </em>
            (Cambridge University Press).
          </p>
        </div>
      </div>

      <div className="maps-resources">
          <p id="maps-rsrc">
            To learn more about coin distribution:
            <br></br>
            <br></br>
            <ul>
              <li>
                Butcher, K. 2001-2002. “Small Change in Ancient Beirut: The Coin
                Finds from BEY 006 and BEY 045: Persian, Hellenistic, Roman, and
                Byzantine Periods,” <em>Berytus</em> 45-46.
              </li>
                <br></br>
              <li>
                Duyrat, F. 2016. <em>Wealth and Warfare: The Archaeology of Money
                in Ancient Syria.</em> New York: The American Numismatic Society.
              </li>
                <br></br>
              <li>
                <a href="https://coinage.princeton.edu/" target="_blank" rel="noopener noreferrer">
                  FLAME: Framing the Late Antique and Early Medieval Economy.
                </a>
              </li>
                <br></br>
              <li>
                <a href="http://dlib.nyu.edu/awdl/isaw/isaw- papers/7/meadows-gruber/" target="_blank" rel="noopener noreferrer">
                  Meadows A. and Gruber, E. 2014. “Coinage and Numismatic Methods.
                  A Case Study of Linking a Discipline,” <em>ISAW Papers</em> 7.15.
                </a>
              </li>
                <br></br>
              <li>
                Neumann, K. Forthcoming. <em>Antioch in Syria: A History from Coins,
                300 BCE-450 CE</em> (Cambridge University Press).
              </li>
                <br></br>
              <li>
                <a href="https://chre.ashmus.ox.ac.uk/" target="_blank" rel="noopener noreferrer">
                  Oxford’s Coin Hoards of the Roman Empire.
                </a>
              </li>
            </ul>
          </p>
      </div>

    </div>

  );
};

export default Roman;
