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
import comp_5_left_mix from "../data/intro-images/comp-5-left-mix.png";
import comp_5_right_mix from "../data/intro-images/comp-5-right-mix.png";
import comp_6_left from "../data/intro-images/comp-6-left.png";
import comp_6_right from "../data/intro-images/comp-6-right.png";
import comp_7_left_mix from "../data/intro-images/comp-7-left-mix.png";
import comp_7_right_mix from "../data/intro-images/comp-7-right-mix.png";
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
        <div className="threeD-coin">
          <p id="intro-style-para" data-aos="fade-left">
            A coin minted for a king celebrates his power and strength.
            (Click on the play button to explore the coin in 3D).
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

        <div className="intro-1-head">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-head" data-aos="fade-left">
            Ancient coins have a tremendous story to tell, but we must first
            learn how to read them.
          </p>
        </div>

        <div className="intro-1-2">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            A little bronze coin has a lot to say too, just like our own U.S.
            dime.
          </p>
        </div>

        <div className="intro-1-3">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-up">
            They are the same size.
          </p>
          <img
            src={us_dime}
            alt="Logo"
            className="size-images"
            data-aos="fade-left"
          />
        </div>

  {/* SECTION 2 */}

        <div className="intro-2-head">
          <img
            src={comp_3_left}
            alt="Logo"
            className="size-images-head"
            data-aos="fade-right"
          />
          <p id="intro-style-head" data-aos="fade-up">
            Both have images and writing on them called a coin’s <span id="term">type</span>.
          </p>
          <img
            src={comp_3_right}
            alt="Logo"
            className="size-images-head"
            data-aos="fade-left"
          />
        </div>

        <div className="intro-2-1">
          <div data-aos="flip-right" style={{width:'300px'}}>
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
          <div data-aos="flip-left" style={{width:'300px'}}>
            <img src={comp_4_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the dime is Franklin D. Roosevelt (the 32nd U.S. President).
            </p>
          </div>
        </div>

        <div className="intro-2-2">
          <img
            src={comp_5_left_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
          <p id="intro-style-para" data-aos="fade-in">
            Just like our coins today, the important person could change.
          </p>
          <img
            src={comp_5_right_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
        </div>

        <div className="intro-2-3">
          <div className="label-image" data-aos="flip-right" style={{width:'300px'}}>
            <img src={comp_6_left} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              This coin has a branch from a laurel tree. It was an important
              symbol for the god Apollo and for the trees that grew in Syria.
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            On the back or <span id="term">reverse</span>, we see important symbols.
          </span>
          <div className="label-image" data-aos="flip-left" style={{width:'300px'}}>
            <img src={comp_6_right} alt="Logo" className="size-images" />
            <p id="intro-style-sub">
              On the dime is an olive branch (meaning peace), a lighted torch
              (meaning liberty), and an oak branch (meaning strength).
            </p>
          </div>
        </div>

        <div className="intro-2-4">
          <img
            src={comp_7_left_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
          <p id="intro-style-para" data-aos="fade-in">
            Just like our coins today, the symbols can change.
          </p>
          <img
            src={comp_7_right_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
        </div>

  {/* SECTION 3 */}

        <div className="intro-3-head">
          <p data-aos="slide-up" id="intro-style-head">
            The citizens wanted to make sure that everyone knew that these coins
            belonged to them.
          </p>
        </div>

        <div className="intro-3-1">
          <img
            src={comp_9_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-up">
            They wrote their name on the coins in Greek: ΑΝΤΙΟΧΕΩΝ, which means
            'Belongs to the Antiochians'.
          </p>
        </div>

        <div className="intro-3-2">
          <p id="intro-style-para" data-aos="fade-right">
            The name was also important because it made clear the governmental
            <span id="term"> authority</span> who gave the cheap bronze value as money.
          </p>
        </div>

        <div className="intro-3-3">
          <p id="intro-style-para" data-aos="fade-up">
            We do the same with our money! The term 'United States of America'
            carries a lot of weight!
          </p>
          <img
            src={comp_11_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
        </div>

        <div className="intro-3-4">
          <p id="intro-style-para" data-aos="fade-in">
            The U.S. dime tells us its <span id="term">denomination</span>, or how much it is worth.
            <br></br>
            <br></br>
            <span id="intro-style-sub">One Dime = 10 cents.</span>
          </p>
          <img
            src={comp_18_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
        </div>

        <div className="intro-3-5">
          <img
            src={comp_19_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            Denomination marks are very rare for ancient Syria. Instead, people
            knew the value based upon a coin’s metal, size, and images.
          </p>
        </div>

  {/* SECTION 4 */}

        <div className="intro-4-head">
          <p id="intro-style-head" data-aos="fade-left">
            The U.S. dime also has other words, or <span id="term">legends</span>. They celebrate our
            government and our values.
          </p>
          <img
            src={comp_14_right}
            alt="Logo"
            className="size-images-head"
            data-aos="fade-right"
          />
        </div>

        <div className="intro-4-1">
          <img
            src={comp_15}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            So did some of the ancient coins! Here we see PAX AVGVSTI or
            “Peace of the Emperors” being celebrated!
          </p>
        </div>

        <div className="intro-4-2-up">
          <p id="intro-style-para" data-aos="fade-left">
            Like our U.S. dime, we can tell when a coin was minted or
            <span id="term"> issued</span>.
          </p>
        </div>

        <div className="intro-4-2">
          <p id="intro-style-sub" data-aos="fade-left">
            This dime was struck in 2013 at the “S” or San Francisco mint.
          </p>
          <img
            src={comp_12_right}
            alt="Logo"
            className="size-images"
            data-aos="flip-right"
            data-aos-duration="2500"
          />
          <img
            src={comp_16_right}
            alt="Logo"
            className="size-images"
            data-aos="flip-left"
            data-aos-duration="2500"
          />
        </div>

        <div className="intro-4-3-up">
          <p id="intro-style-para" data-aos="fade-down">
            People in ancient Syria used Greek letters to indicate the date.
          </p>
        </div>

        <div className="intro-4-3">
          <img
            src={comp_13_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-sub" data-aos="fade-right">
            Here, the ΔΡ tells us that the coin was minted in 55/56 CE, during
            the reign of emperor Nero.
          </p>
        </div>

        <div className="intro-4-4">
          <img
            src={comp_17}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-sub" data-aos="fade-left">
            A <span id="term">mint mark</span> on an ancient coin can indicate the minting city, but it
            may also be a production mark or hint at who paid for the coins.
            Sometimes the mint mark is a mystery!
          </p>
        </div>

        <div className="intro-4-5">
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
              A coin could be cut in half too, likely as an attempt to make more coins when minting stopped.
            </p>
          </div>
        </div>

        {/* <div className="component-20">
          <img
            src={comp_20}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            Sometimes we see countermarks. These are marks stamped on a
            circulating coin to give it extra value or keep it working as money.
            Cities and governments could do this, but so could the military.
          </p>
        </div>
        <div className="component-21">
          <img
            src={comp_21}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            Sometimes, a coin would be cut in half.We aren’t quite sure why,
            but it likely was an attempt to make more coins when you couldn’t
            mint more.
          </p>
        </div> */}

  {/* SECTION 5 */}

        <div className="intro-5">
          <h2 id="intro-style-para" data-aos="fade-right">
            There’s so much to explore when it comes to ancient AND modern coins. Are you ready to learn more?
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

        <div className="intro-resources" style={{width:"100%", height:"1100px"}}>
            <p id="religious-style-rsrc">
              Coin Images Courtesy of:
              <br></br>
              <br></br>
              <ul>
                <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507404h.r=Neron%20Neron?rk=150215;2" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 180 </a></li>
                  <br></br>
                <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507493h.r=Hadrian%20Hadrian?rk=515024;0" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 430</a></li>
                  <br></br>
                <li><a href="https://ikmk.smb.museum/object?lang=en&id=18215628" target="_blank" rel="noopener noreferrer">Münzkabinet, Staatliche Museen zu Berlin, 18215628; photograph by Dirk Sonnenwald </a></li>
                  <br></br>
                <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b84742087?rk=107296;4" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Chandon de Briailles 1446</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1944.100.32580" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1944.100.32580</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1981.43.1" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1981.43.1</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1947.2.372" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1947.2.372</a></li>
                  <br></br>
                <li><a href="https://ikmk.smb.museum/object?id=18201044" target="_blank" rel="noopener noreferrer">Münzkabinett, Staatliche Museen zu Berlin, 18201044; photograph by Reinhard Saczewski</a></li>
                  <br></br>
                <li><a href="http://numismatics.org/collection/1996.71.3?lang=en" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1996.71.3 </a></li>
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
                <li>Casey, P.J. 1986. <em>Understanding Ancient Coins</em>. Norman: University of Oklahoma Press.</li>
                  <br></br>
                <li>Howgego, C. 1995. <em>Ancient History from Coins</em>. London: Routledge.</li>
                  <br></br>
                <li>Howgego, C., Heuchert, V., and Burnett, A. (eds.) 2005. <em>Coinage and Identity in the Roman Provinces</em>. Oxford University Press.</li>
                  <br></br>
                <li>Metcalf, W.E. (ed.). 2012. <em>The Oxford Handbook of Greek and Roman Coinage</em>. Oxford University Press.</li>
              </ul>
            </p>
        </div>

      </div>
    </div>
  );
};

export default Intro;
