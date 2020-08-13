import React from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "aos/dist/aos.css";
import logo from "../data/intro-images/Logo.png";
import img_2 from "../data/intro-images/img-1.png";
import us_dime from "../data/intro-images/us-dime.png";
import comp_3_left from "../data/intro-images/comp-3-left.png";
import comp_3_right from "../data/intro-images/comp-3-right.png";
import comp_4_left from "../data/intro-images/comp-4-left.png";
import comp_4_right from "../data/intro-images/comp-4-right.png";
import comp_6_left from "../data/intro-images/comp-6-left.png";
import comp_6_right from "../data/intro-images/comp-6-right.png";
import comp_9_right from "../data/intro-images/comp-9-right.png";
import comp_11_right from "../data/intro-images/comp-11-right.png";
import comp_12_right from "../data/intro-images/comp-12-right.png";
import comp_13_right from "../data/intro-images/comp-13-right.png";
import comp_14_right from "../data/intro-images/comp-14-right.png";
import comp_15 from "../data/intro-images/comp-15.png";
import comp_16_right from "../data/intro-images/comp-16-right.png";
import comp_17 from "../data/intro-images/comp-17.png";
import comp_18_right from "../data/intro-images/comp-18-right.png";
import comp_19_mix from "../data/intro-images/comp-19-mix.png";
import comp_20 from "../data/intro-images/comp-20.png";
import comp_21 from "../data/intro-images/comp-21.png";
import scroll_down from "../data/intro-images/scroll-down-2.png";
import seleucidTetradrachm from "../data/mapcoins-images/seleucidTetradrachm.png";
import romanAureus from "../data/mapcoins-images/romanAureus.png";
import usQuarter from "../data/mapcoins-images/usQuarter.png";
import euro from "../data/mapcoins-images/euro.png";
import syrianProvincial from "../data/mapcoins-images/syrianProvincial.png";
import egyptianTetradrachm from "../data/mapcoins-images/egyptianTetradrachm.png";
import usStateQuarter from "../data/mapcoins-images/usStateQuarter.png";
import germanPfennig from "../data/mapcoins-images/germanPfennig.png";
import antiochCoin from "../data/mapcoins-images/antiochCoin.png";
import zeugmaCoin from "../data/mapcoins-images/zeugmaCoin.png";
import nycFinal from "../data/mapcoins-images/nycFinal.png";
import parisCoin from "../data/mapcoins-images/parisCoin.png";
import maps from "../data/mapcoins-images/maps.png";
import circulationMap from "../data/mapcoins-images/circulationMap.png";
import bronze_17mm from "../data/intro-images/bronze_17mm.png";
import silver_24mm from "../data/intro-images/silver_24mm.png";
import dime_17mm from "../data/intro-images/dime_17mm.png";
import quarter_24mm from "../data/intro-images/quarter_24mm.png";

import "../IntroPage/intro.css";

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

const Intro = () => {
  AOS.init({
    duration: 1000,
    offset: -25,
  });

  return (
    <div className="intro-page">
      <div className="class-title">
        <div className="intro-main-title">
          <p data-aos="fade-in">The</p>
          <h1 data-aos="fade-in" className="intro-main-title-h1">
            SYRIOS
          </h1>
          <h2 data-aos="fade-in" className="intro-main-title-h2">
            PROJECT
          </h2>
          <p className="intro-main-subtitle" data-aos="fade-in">
            Studying{" "}
            <span style={{ color: "#2d616a" }}>Urban Relationships</span> and
            Identity over{" "}
            <span style={{ color: "#2d616a" }}>Ancient Syria</span>
          </p>
          <span>
            <img
              src={logo}
              className="title-logo"
              data-aos="fade-in"
              alt="logo"
            />
          </span>
        </div>
      </div>
      <div className="flex-intro-buttons">
        <StyledLink
          to="/select-story"
          className="header-explore-left"
        >
          TELL ME A STORY
        </StyledLink>
        <div>
        <img
            src={scroll_down}
            alt="scroll"
            className="class-scroll"
            data-aos="fade-down"
          />
          <h4>HOW TO READ A COIN?</h4>
        </div>
        <StyledLink
          to="/explore"
          className="header-explore-right"
        >
          LET ME EXPLORE
        </StyledLink>
      </div>

  {/* SECTION 1 */}

    <div className="component-mix">

        <div className="intro-1-head">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-head" data-aos="fade-left">
            During the time of the Greeks and Romans, many different governments
            minted their own coins within Syria. To learn their stories, we must
            first learn how to read them.
          </p>
        </div>

        <div className="intro-1-1">
          <div data-aos="flip-right">
            <img
              src={seleucidTetradrachm}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={romanAureus}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              A royal Seleucid tetradrachm and an imperial Roman aureus.
            </p>
          </div>
          <p data-aos="fade-in" id="intro-style-para">
            Some of these coins were for kings and emperors. These are like our federal
            U.S. coins or the European Union coins.
          </p>
          <div data-aos="flip-left">
            <img
              src={usQuarter}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={euro}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              A U.S. quarter and a 1 Euro coin.
            </p>
          </div>
        </div>

        <div className="threeD-coin">
          <p id="intro-style-para" data-aos="fade-left">
            A coin minted for a king celebrates his power and strength.
          </p>
          <div class="sketchfab-embed-wrapper" data-aos="fade-in">
            <iframe
              title="A 3D model"
              width="640"
              height="480"
              src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed?autostart=1&autospin=0.5&preload=1&amp;ui_controls=1&amp;ui_infos=1&amp;ui_inspector=1&amp;ui_stop=1&amp;ui_watermark=1&amp;ui_watermark_link=1"
              frameborder="0"
              allow="autoplay; fullscreen; vr"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            ></iframe>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "normal",
                margin: "5px",
                color: "#4A4A4A",
              }}
            >
              <a
                href="https://sketchfab.com/3d-models/eastern-kings-coin-033a5ed32de347e1be254042555ad0c4?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                Eastern King&#39;s Coin {" "}
              </a>
              by{" "}
              <a
                href="https://sketchfab.com/peggylind?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                peggylind {" "}
              </a>
              on {" "}
              <a
                href="https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                Sketchfab
              </a>
            </p>
          </div>
        </div>

        <div className="intro-1-2">
          <div data-aos="flip-right">
            <img
              src={syrianProvincial}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={egyptianTetradrachm}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              A Syrian provincial coin and an Egyptian tetradrachm.
            </p>
          </div>
          <p data-aos="fade-in" id="intro-style-para">
            Other coins were for provinces or regions. This would be like if the
            states of America minted their own coins.
          </p>
          <div data-aos="flip-left">
            <img
              src={usStateQuarter}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={germanPfennig}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              A U.S. state quarter and a 10 German pfennig.
            </p>
          </div>
        </div>

        <div className="intro-1-3">
          <div data-aos="flip-right">
            <img
              src={antiochCoin}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={zeugmaCoin}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              Civic coins from Antioch and Zeugma in Syria.
            </p>
          </div>
          <p data-aos="fade-in" id="intro-style-para">
            Many individual cities and peoples in Syria and the Middle East also
            minted their own coins. This is like if New York or Chicago or Paris
            or London minted their own coins.
          </p>
          <div data-aos="flip-left">
            <img
              src={nycFinal}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={parisCoin}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              Imagined civic coins from New York and Paris.
            </p>
          </div>
        </div>

        <div className="intro-1-4">
          <p data-aos="fade-right" id="intro-style-para">
            All of this minting continued in Syria, even while the region was ruled
            by the Seleucid kings and Roman empire.</p>
          <img
            src={maps}
            alt="Logo"
            data-aos="fade-left"
          />
        </div>

    {/* SECTION 2 */}

        <div className="intro-2-head">
          <img
            src={img_2}
            alt="Logo"
            className="size-images-head"
            data-aos="fade-right"
          />
          <p id="intro-style-head" data-aos="fade-left">
            A little bronze coin has a lot to say too, just like our own U.S.
            dime.
          </p>
        </div>

        <div className="intro-2-1">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-up">
             In fact, this coin has a lot in common with a U.S. dime.
          </p>
          <img
            src={us_dime}
            alt="Logo"
            className="size-images"
            data-aos="fade-left"
          />
        </div>

        <div className="intro-2-2">
          <p id="intro-style-para" data-aos="fade-up">
             They are the same size.
          </p>
        </div>

        <div className="intro-2-3">
          <img
            src={comp_3_left}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-up">
            Like the dime, the little bronze coin has images and writing which form its <span id="term">type</span>.
          </p>
          <img
            src={comp_3_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-left"
          />
        </div>

        <div className="intro-2-4">
          <div data-aos="flip-right">
            <img
              src={comp_4_left}
              alt="Logo"
              className="size-images"
              data-aos=""
            />
            <p id="intro-style-sub">
              On the ancient bronze coin is Apollo (the Greek god of archery,
              music, and light).
            </p>
          </div>
          <p id="intro-style-para" data-aos="fade-up">
            On the front or <span id="term">obverse</span>, we see the head of an important person.
          </p>
          <div data-aos="flip-left">
            <img src={comp_4_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the dime is Franklin D. Roosevelt (the 32nd U.S. President).
            </p>
          </div>
        </div>

        <div className="intro-2-5">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_6_left} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This coin has a branch from a laurel tree. It was an important
              symbol for the god Apollo and for the trees that grew in Syria.
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            On the back or <span id="term">reverse</span>, we see important symbols.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_6_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the dime is an olive branch (meaning peace), a lighted torch
              (meaning liberty), and an oak branch (meaning strength).
            </p>
          </div>
        </div>

        <div className="intro-2-6">
          <p id="intro-style-para" data-aos="fade-up">
             In addition to symbols, many coins also have <span id="term">legends </span>
             or writing on them
          </p>
        </div>

        <div className="intro-2-7">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_9_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This bronze coin has a civic <span id="term">ethnic</span> or name
              of the citizens in Greek. It reads ΑΝΤΙΟΧΕΩΝ, which means 'Belongs
              to the Antiochians'
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            Sometimes the <span id="term">legend</span> tells us about the government
            behind the minting of the coin.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_11_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the right side caption under the image: This dime identifies
              itself as belonging to the United States of America.
            </p>
          </div>
        </div>

        <div className="intro-2-8">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_15} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the left side caption under the image: This silver radiate
              celebrates PAX AVGVSTI or “Peace of the Emperors.”
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            Sometimes the <span id="term">legend</span> celebrates the government
            or community values.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_14_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This dime celebrates the official national motto and a key value of
              the United States.
            </p>
          </div>
        </div>

  {/* SECTION 3 */}

        <div className="intro-3-head">
          <p data-aos="slide-up" id="intro-style-head">
            With these images and legends, coins made clear which governmental
            authority gave the coins value as money.
          </p>
        </div>

        <div className="intro-3-1-up">
          <p data-aos="fade-in" id="intro-style-para" style={{width: "800px"}}>
            Because of the uniqueness of each coin and the issuing authority that
            guaranteed its value (e.g., individual cities, provinces, kingdoms,
            imperial governments), not all coins were accepted everywhere as currency.
          </p>
        </div>

        <div className="intro-3-1">
          <img
            src={circulationMap}
            alt="Logo"
          />
          <p id="intro-style-sub">
            This map shows how the coins of different authorities are believed to
            have generally circulated. Actual evidence, however, shows tremendous
            variation.
          </p>
        </div>

        <div className="intro-3-2">
          <p data-aos="fade-in" id="intro-style-para" style={{width: "800px"}}>
            We can use digital technologies to map where, when, and in what quantities
            each Syrian community’s coins appear in the archaeological record. This
            can help us identify regional and empire-wide limits in their movement
            and in their <span id="term">circulation</span> as money.
          </p>
        </div>

  {/* SECTION 4 */}

        <div className="intro-4-head">
          <p id="intro-style-head" data-aos="fade-left">
            The coins have many other features to notice.
          </p>
        </div>

        <div className="intro-4-1">
          <div data-aos="flip-right">
            <img
              src={bronze_17mm}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={silver_24mm}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              Denomination marks are very rare for ancient Syria. instead, people
              knew the value based upon a coin’s metal, size, and images.
            </p>
          </div>
          <p data-aos="fade-in" id="intro-style-para">
            The <span id="term">denomination</span> of a coin means how
            much a coin is worth as money.
          </p>
          <div data-aos="flip-left">
            <img
              src={dime_17mm}
              alt="Logo"
              className="size-images-sm"
            />
            <img
              src={quarter_24mm}
              alt="Logo"
              className="size-images-sm"
            />
            <p id="intro-style-sub">
              Modern coins are different metals and sizes, but they also tell us
              how much they are worth.
            </p>
          </div>
        </div>

        <div className="intro-4-2">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_13_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              Greek letters indicate the date on Syrian coins. The ΔΡ tells us that
              the coin was minted in 55/56 CE, during the reign of emperor Nero.
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            Letters and numbers can tell us when a coin was minted.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_12_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This dime was minted in 2013.
            </p>
          </div>
        </div>

        <div className="intro-4-3">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_17} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              Ancient mint marks may indicate the minting city, but it may also
              be a production mark hinting at who paid for the coins or remain a mystery.
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            <span id="term">Mint marks</span> are letters or symbols which can indicate where a coin was struck.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_16_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This dime was struck at the San Francisco mint.
            </p>
          </div>
        </div>

        <div className="intro-4-4">
          <div data-aos="flip-right">
            <img
              src={comp_20}
              alt="Logo"
              className="size-images"
              data-aos="fade-in"
            />
            <p id="intro-style-sub" data-aos="fade-down">
              A <span id="term">countermark</span> was stamped on a circulating
              coin to give it extra value or keep it working as money.
            </p>
          </div>
          <p id="intro-style-para" data-aos="fade-up">
            And watch out for other marks and modifications to the coins!
          </p>
          <div data-aos="flip-left">
            <img src={comp_21} alt="Logo" className="size-images" data-aos="fade-in"/>
            <p id="intro-style-sub" data-aos="fade-down">
              A coin could be cut in half too, likely as an attempt to make more
              coins when minting stopped.
            </p>
          </div>
        </div>

  {/* SECTION 5 */}

        <div className="intro-5">
          <h2 id="intro-style-para" data-aos="fade-right">
            Ancient coins have so much to say, as pieces of art, as objects that
            move, and as representatives of the people who minted and used them.
            Are you ready to learn more?
          </h2>
        </div>

        <div className="intro-5-1">
          <StyledLink to="/select-story" id="intro-style-footer" data-aos="fade-right">
            {" "}
            Tell me a Story{" "}
          </StyledLink>
          <StyledLink to="/coins" id="intro-style-footer" data-aos="fade-left">
            {" "}
            Explore Coins{" "}
          </StyledLink>
        </div>

        <div className="intro-resources">
            <p id="religious-style-rsrc">
              Coin Images Courtesy of:
              <br></br>
              <br></br>
              <ul>
                <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507404h.r=Neron%20Neron?rk=150215;2" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 180 </a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1944.100.75243" target="_blank" rel="noopener noreferrer">American Numismatic Society 1944.100.75243</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1944.100.39966" target="_blank" rel="noopener noreferrer">American Numismatic Society 1944.100.39966</a></li>
                  <br></br>
                <li><a href="https://ikmk.smb.museum/object?lang=en&id=18215628" target="_blank" rel="noopener noreferrer">Münzkabinet, Staatliche Museen zu Berlin, 18215628; photograph by Dirk Sonnenwald</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1937.999.318" target="_blank" rel="noopener noreferrer">American Numismatic Society 1937.999.318</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1944.100.65231" target="_blank" rel="noopener noreferrer">American Numismatic Society 1944.100.65231</a></li>
                  <br></br>
                <li><a href="https://ikmk.smb.museum/object?id=18201044" target="_blank" rel="noopener noreferrer">Münzkabinett, Staatliche Museen zu Berlin, 18201044; photograph by Reinhard Saczewski</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1996.71.3?lang=en" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1996.71.3</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1999.2.2" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1999.2.2</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1944.100.65544" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1944.100.65544</a></li>
            </ul>
              <br></br>
              <br></br>
              To read more, check these out:
              <br></br>
              <br></br>
              <ul>
                <li>Burnett, A. 1987. <em>Coinage in the Roman World</em>. London: Seaby. </li>
                  <br></br>
                <li>Butcher, K. 2001-2002. “Small Change in Ancient Beirut: The Coin Finds from BEY 006 and BEY 045: Persian, Hellenistic, Roman, and Byzantine Periods,” <em>Berytus</em> 45-46.</li>
                  <br></br>
                <li>Casey, P.J. 1986. <em>Understanding Ancient Coins</em>. Norman: University of Oklahoma Press.</li>
                  <br></br>
                <li>Howgego, C. 1995. <em>Ancient History from Coins</em>. London: Routledge.</li>
                  <br></br>
                <li>Howgego, C., Heuchert, V., and Burnett, A. (eds.) 2005. <em>Coinage and Identity in the Roman Provinces</em>. Oxford University Press.</li>
                  <br></br>
                <li>Metcalf, W.E. (ed.). 2012. <em>The Oxford Handbook of Greek and Roman Coinage</em>. Oxford University Press.</li>
                  <br></br>
                <li>Neumann, K. Forthcoming. <em>Antioch in Syria: A History from Coins, 300 BCE-450 CE</em> (Cambridge University Press).</li>
              </ul>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Intro;
