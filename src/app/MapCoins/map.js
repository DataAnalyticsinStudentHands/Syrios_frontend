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

{/* SECTION 2 */}

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
        <div data-aos="fade-in">
          <img
            src={circulationMap}
            alt="Logo"
          />
          <p id="maps-sub">
            This map shows how the coins of different authorities are believed to
            have generally circulated. Actual evidence, however, shows tremendous
            variation.
          </p>
        </div>
      </div>

      <div className="maps-2-2">
        <p data-aos="fade-in" id="maps-para">
          Using digital technologies to map where, when, and in what quantities
          each Syrian community’s coins appear in the archaeological record can
          identify regional and empire-wide limits in their movement and in their
          <span id="term"> circulation</span> as money.
        </p>
      </div>

{/* SECTION 3 */}

      <div className="maps-3-head">
        <p id="maps-head" data-aos="fade-up">
          Consider the coins minted at Antioch and the percentages in which they
          have been found compared to other excavated coins scattered within each
          archaeological site.
        </p>
      </div>

      <div className="maps-3-1">
        <p id="maps-sub" data-aos="fade-in">
           Explore how a coin’s attributes – like metal, minting period, or
           issuing authority – or external factors – like distance or political
           borders – can change how a coin moved over space and time.
        </p>
        <br></br>
        <div>
          <CoinsExcavations data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon c. 100,000 coin finds published in
            80 excavation reports. See Appendix 2 in Neumann, K. <em>Antioch in Syria:
            A History from Coins, 300 BCE-450 CE</em> (Cambridge University Press).
          </p>
        </div>
      </div>

      <div className="maps-3-2">
        <p data-aos="fade-in" id="maps-para">
          The patterns we see can slightly change whether we look at single coins
          found scattered across an archaeological site or coins buried in a
          <span id="term"> hoard</span> – a cache or collection of multiple coins
          in a single location.
        </p>
      </div>

      <div className="maps-3-3">
        <p id="maps-sub" data-aos="fade-in">
           This map consists of silver and gold Antioch coins.  Silver and gold
           coins can be rare finds on an archaeological site, because people would
           spend effort at recovering them if dropped. Hoards, however, are often
           created when a person intentionally tries to hides valuable coins either
           as savings or in times of emergency.
        </p>
        <br></br>
        <div>
          <Coins data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon c. 215,000 coin finds published in
            300+ coin reports. See Appendix 3 in Neumann, K. <em>Antioch in Syria:
            A History from Coins, 300 BCE-450 CE</em> (Cambridge University Press).
          </p>
        </div>
      </div>

      <div className="maps-3-4">
        <p data-aos="fade-in" id="maps-para">
          Narrowing in on the coins excavated within a single city – such as
          Antioch – can also tell us about coin use and people movement there.
        </p>
      </div>

      <div className="maps-3-5">
        <p id="maps-sub" data-aos="fade-in">
           Notice how the majority of coins found in the city were minted locally,
           which may suggest local preference or even regulation of circulating
           currency. Still, coins traveled to Antioch from as far away as Rome
           and Seleucia on the Tigris.
        </p>
        <br></br>
        <div>
          <Excavations data-aos="fade-in"/>
          <p id="captions" data-aos="fade-in">
            This visualization is based upon 10,000+ coins dating between 330 BCE
            and 450 CE and excavated at <em>Antioch. The coin catalog was published
            by D.B. Waagé, D. in Antioch-on-the-Orontes IV.2: Greek, Roman, Byzantine,
            and Crusader Coins</em> (Princeton University Press, 1952).
            <br></br>
            Click here to download this data
          </p>
        </div>
      </div>

      <div className="maps-3-6">
        <p data-aos="fade-in" id="maps-para">
          Ultimately, these patterns – when examined alongside other texts and
          archaeological evidence – can help us understand the activity, policies,
          and relationships of the different peoples minting and using the coins.
        </p>
      </div>

      <div className="maps-resources">
          <p id="maps-rsrc">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li>
                <a href="http://numismatics.org/collection/1944.100.75243" target="_blank" rel="noopener noreferrer">
                  American Numismatic Society 1944.100.75243
                </a>
              </li>
                <br></br>
              <li>
                <a href="http://numismatics.org/collection/1944.100.39966" target="_blank" rel="noopener noreferrer">
                  American Numismatic Society 1944.100.39966
                </a>
              </li>
                <br></br>
              <li>
                <a href="https://ikmk.smb.museum/object?lang=en&amp;amp;id=18215628" target="_blank" rel="noopener noreferrer">
                  Münzkabinet, Staatliche Museen zu Berlin, 18215628; photograph by Dirk Sonnenwald
                </a>
              </li>
                <br></br>
              <li>
                <a href="http://numismatics.org/collection/1937.999.318" target="_blank" rel="noopener noreferrer">
                  American Numismatic Society 1937.999.318
                </a>
              </li>
                <br></br>
              <li>
                <a href="https://gallica.bnf.fr/ark:/12148/btv1b8507404h.r=Neron Neron?rk=150215;2" target="_blank" rel="noopener noreferrer">
                  Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 180
                </a>
              </li>
                <br></br>
              <li>
                <a href="http://numismatics.org/collection/1944.100.65231" target="_blank" rel="noopener noreferrer">
                  American Numismatic Society 1944.100.65231
                </a>
              </li>
            </ul>
            <br></br>
            <br></br>
            To read more, check these out:
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
                <a href="https://coinage.princeton.edu/" target="_blank" rel="noopener noreferrer">
                  FLAME: Framing the Late Antique and Early Medieval Economy.
                </a>
              </li>
                <br></br>
              <li>
                <a href="http://dlib.nyu.edu/awdl/isaw/isaw- papers/7/meadows-gruber/" target="_blank" rel="noopener noreferrer">
                  Meadows A. and Gruber, E. 2014. “Coinage and Numismatic Methods. A Case Study of Linking a Discipline,” <em>ISAW Papers</em> 7.15.
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
