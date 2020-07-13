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
import comp_9_left from "../data/intro-images/comp-9-left.png";
import comp_9_right from "../data/intro-images/comp-9-right.png";
import comp_11_left from "../data/intro-images/comp-11-left.png";
import comp_11_right from "../data/intro-images/comp-11-right.png";
// import comp_12_left from "../data/intro-images/comp-12-left.png";
import comp_12_right from "../data/intro-images/comp-12-right.png";
import comp_13_left from "../data/intro-images/comp-13-left.png";
import comp_13_right from "../data/intro-images/comp-13-right.png";
import comp_14_left from "../data/intro-images/comp-14-left.png";
import comp_14_right from "../data/intro-images/comp-14-right.png";
import comp_15 from "../data/intro-images/comp-15.png";
// import comp_16_left from "../data/intro-images/comp-16-left.png";
import comp_16_right from "../data/intro-images/comp-16-right.png";
import comp_17 from "../data/intro-images/comp-17.png";
import comp_18_left from "../data/intro-images/comp-18-left.png";
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
      <div className="component-mix">
        <div className="threeD-coin">
          <p id="intro-style-para" data-aos="fade-left">
            A coin minted for a king celebrates his power and strength.
          </p>
          <div class="sketchfab-embed-wrapper" data-aos="fade-in">
            <iframe
              title="A 3D model"
              width="640"
              height="480"
              src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed?preload=1&amp;ui_controls=1&amp;ui_infos=1&amp;ui_inspector=1&amp;ui_stop=1&amp;ui_watermark=1&amp;ui_watermark_link=1"
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
        <div className="component-1">
          <img
            src={img_2}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            Ancient coins have a tremendous story to tell, but we must first
            learn how to read them.
          </p>
        </div>
        <div className="component-1-2">
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
        <div className="component-2">
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
        <div className="component-3">
          <img
            src={comp_3_left}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-up">
            Both have images and writing on them called a coin’s <span style={{fontWeight:'bolder', fontStyle:"italic"}}>type</span>
          </p>
          <img
            src={comp_3_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-left"
          />
        </div>
        <div className="component-4">
          <div data-aos="flip-right">
            <img
              src={comp_4_left}
              alt="Logo"
              className="size-images"
              data-aos=""
            />
            <p id="style-caption">
              On the ancient bronze coin is Apollo (the Greek god of archery,
              music, and light).
            </p>
          </div>
          <p id="intro-style-para" data-aos="fade-up">
            On the front or <span style={{fontWeight:"bolder", fontStyle:"italic"}}>obverse</span>, we see the head of an important person.
          </p>
          <div data-aos="flip-left">
            <img src={comp_4_right} alt="Logo" className="size-images" />
            <p id="style-caption">
              On the dime is Franklin D. Roosevelt (the 32nd U.S. President).{" "}
            </p>
          </div>
        </div>
        <div className="component-5">
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
        <div className="component-6">
          <div className="label-image" data-aos="flip-right">
            <img src={comp_6_left} alt="Logo" className="size-images" />
            <p id="style-caption">
              This coin has a branch from a laurel tree. It was an important
              symbol for the god Apollo and for the trees that grew in Syria.
            </p>
          </div>
          <span id="intro-style-para" data-aos="fade-up">
            On the back or <span style={{fontWeight:'bolder', fontStyle:'italic'}}>reverse</span>, we see important symbols.
          </span>
          <div className="label-image" data-aos="flip-left">
            <img src={comp_6_right} alt="Logo" className="size-images" />
            <span id="style-caption">
              On the dime is an olive branch (meaning peace), a lighted torch
              (meaning liberty), and an oak branch (meaning strength).
            </span>
          </div>
        </div>
        <div className="component-7">
          <img
            src={comp_7_left_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
          <span id="intro-style-para" data-aos="fade-in">
            Just like our coins today, the symbols can change
          </span>
          <img
            src={comp_7_right_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-up"
          />
        </div>
        <div className="component-8">
          <h2
            data-aos="slide-up"
            id="intro-style-para"
            style={{ width: "800px" }}
          >
            The citizens wanted to make sure that everyone knew that these coins
            belonged to them
          </h2>
        </div>
        <div className="component-9">
          <img
            src={comp_9_left}
            alt="Logo"
            className="size-images"
          />
          <img
            src={comp_9_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para-blue" data-aos="fade-up">
            They wrote their name on the coins in Greek: ΑΝΤΙΟΧΕΩΝ, which means 'Belongs to the Antiochians'.
          </p>
        </div>
        <div className="component-10">
          <p className="align-subtitle">
            <h2
              data-aos="slide-up"
              id="intro-style-para"
              style={{ width: "800px" }}
            >
              The name was also important because it made clear the governmental <span style={{fontWeight:'bolder', fontStyle:'italic'}}>authority</span> who gave the cheap bronze value as money.
            </h2>
          </p>
        </div>
        <div className="component-11">
          <img
            src={comp_11_left}
            alt="Logo"
            className="size-images"
          />
          <img
            src={comp_11_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para-blue" data-aos="fade-up">
            We do the same with our money! The term 'United States of America'
            carries a lot of weight!
          </p>
        </div>
        {/* <div className="component-12">
          <img
            src={comp_12_left}
            alt="Logo"
            className="size-images"
          />
          <img
            src={comp_12_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            Like our U.S. dime, we can tell when a coin was minted or issued.
          </p>
        </div> */}
        <div className="component-13">
          <img
            src={comp_13_left}
            alt="Logo"
            className="size-images"
          />
          <img
            src={comp_13_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para-blue">
            People in ancient Syria used Greek letters to indicate the date. Here, the ΔΡ tells us that the coin was minted in 55/56 CE, during the reign of emperor Nero.
          </p>
        </div>
        <div className="component-14">
          <img
            src={comp_14_left}
            alt="Logo"
            className="size-images"
          />
          <img
            src={comp_14_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-left">
            The U.S. dime also has other words, or <span style={{fontWeight:'bolder', fontStyle:'italic'}}>legends</span>. They celebrate our
            government and our values.
          </p>
        </div>
        <div className="component-15">
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
        <div className="component-16">
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
          <p id="intro-style-para" data-aos="fade-left">
          Like our U.S. dime, we can tell when a coin was minted or issued.<br></br><p id="intro-style-para-blue">Our U.S. dime tells us when and where a coin was minted or issued. This coin was struck in 2013 at the “S” or San Francisco mint.</p>
          </p>
        </div>
        <div className="component-17">
          <img
            src={comp_17}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para-blue" data-aos="fade-left">
            <span style={{fontWeight:'bolder', fontStyle:'italic'}}>Mint marks</span> on ancient coins can indicate the minting city, but may also be a production mark or who paid for the coins. Sometimes the mint mark is a mystery!
          </p>
        </div>
        <div className="component-18">
          <img
            src={comp_18_left}
            alt="Logo"
            className="size-images"
            data-aos="fade-in"
          />
          <img
            src={comp_18_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para" data-aos="fade-in">
            The U.S. dime tells us its <span style={{fontWeight:'bolder', fontStyle:'italic'}}>denomination</span>, or how much it is worth.<br></br><br></br> <span id="intro-style-para-blue">One Dime = 10 cents.</span>
          </p>
        </div>
        <div className="component-19">
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
        <div className="component-30">
          <div data-aos="flip-right">
            <img
              src={comp_20}
              alt="Logo"
              className="size-images"
              data-aos="fade-in"
            />
            <p id="style-caption" data-aos="fade-down">
              A <span style={{fontWeight:'bolder', fontStyle:'italic'}}>countermark</span> was stamped on a circulating coin to give it extra value or keep it working as money.
            </p>
          </div>
          <p id="intro-style-para" data-aos="fade-up">
            And watch out for other marks and modifications to the coins!
          </p>
          <div data-aos="flip-left">
            <img src={comp_21} alt="Logo" className="size-images" data-aos="fade-in"/>
            <p id="style-caption" data-aos="fade-down">
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
        <div className="component-22">
          <StyledLink
            to="/select-story"
            id="intro-style-footer"
            data-aos="fade-right"
          >
            {" "}
            Tell me a Story{" "}
          </StyledLink>
          <h2 id="intro-style-para">
            There’s so much to explore when it comes to ancient AND modern coins. Are you ready to learn more?
          </h2>
          <StyledLink to="/coins" id="intro-style-footer" data-aos="fade-left">
            {" "}
            Explore Coins{" "}
          </StyledLink>
        </div>
      </div>
    </div>
  );
};

export default Intro;
