import React from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
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
import comp_12_left from "../data/intro-images/comp-12-left.png";
import comp_12_right from "../data/intro-images/comp-12-right.png";
import comp_13_left from "../data/intro-images/comp-13-left.png";
import comp_13_right from "../data/intro-images/comp-13-right.png";
import comp_14_left from "../data/intro-images/comp-14-left.png";
import comp_14_right from "../data/intro-images/comp-14-right.png";
import comp_15 from "../data/intro-images/comp-15.png";
import comp_16_left from "../data/intro-images/comp-16-left.png";
import comp_16_right from "../data/intro-images/comp-16-right.png";
import comp_17 from "../data/intro-images/comp-17.png";
import comp_18_left from "../data/intro-images/comp-18-left.png";
import comp_18_right from "../data/intro-images/comp-18-right.png";
import comp_19_mix from "../data/intro-images/comp-19-mix.png";
import comp_20 from "../data/intro-images/comp-20.png";
import comp_21 from "../data/intro-images/comp-21.png";
import scroll_down from "../data/intro-images/scroll-down-2.png";

import "../IntroPage/intro.css";

const Intro = () => {
  AOS.init({
    duration: 2500,
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
            Identify over{" "}
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
        <div className="intro-read-coin">
          <h4 data-aos="fade-in">HOW TO READ A COIN?</h4>
          <img
            src={scroll_down}
            alt="scroll"
            className="class-scroll"
            data-aos="slide-down"
          />
        </div>
      </div>
      <div>
        <Link
          to="/civic-story"
          className="header-explore-left"
          data-aos="fade-left"
        >
          TELL ME A STORY
        </Link>
        <Link
          to="/coins"
          className="header-explore-right"
          data-aos="fade-right"
        >
          EXPLORE COINS
        </Link>
      </div>
      <div className="component-mix">
        <div className="threeD-coin">
          <div class="sketchfab-embed-wrapper">
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
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                Eastern King&#39;s Coin
              </a>
              by{" "}
              <a
                href="https://sketchfab.com/peggylind?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
                target="_blank"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                peggylind
              </a>
              on{" "}
              <a
                href="https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup"
                target="_blank"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
                Sketchfab
              </a>
            </p>
          </div>
        </div>
        <div className="component-1">
          <img src={img_2} alt="Logo" className="size-images" />
          <span id="intro-style-para">
            Ancient coins have a tremendous story to tell
          </span>
        </div>
        <div className="component-2">
          <img src={us_dime} alt="Logo" className="size-images" />
          <p id="intro-style-para">
            This bronze coin from Syria has the same size that of an US dime
          </p>
          <img src={img_2} alt="Logo" className="size-images" />
        </div>
        <div className="component-3">
          <img src={comp_3_left} alt="Logo" className="size-images" />
          <p id="intro-style-para">
            Both have images and writing on them called "coin's type"
          </p>
          <img src={comp_3_right} alt="Logo" className="size-images" />
        </div>
        <div className="component-4">
          <div data-aos="flip-right">
            <img src={comp_4_left} alt="Logo" className="size-images" />
            <span className="caption">
              On the ancient bronze coin is Apollo (the Greek god of archery,
              music, and light).
            </span>
          </div>
          <span id="intro-style-para">
            On the front, we see the head of an important person
          </span>
          <div data-aos="flip-left">
            <img src={comp_4_right} alt="Logo" className="size-images" />
            <span className="caption">
              On the dime is Franklin D. Roosevelt (the 32nd U.S. President).{" "}
            </span>
          </div>
        </div>
        <div className="component-5">
          <img
            src={comp_5_left_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-right"
          />
          <span id="intro-style-para">
            Just like our coins today, the important person can change
          </span>
          <img
            src={comp_5_right_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-left"
          />
        </div>
        <div className="component-6">
          <div className="label-image" data-aos="zoom-in">
            <img src={comp_6_left} alt="Logo" className="size-images" />
            <span className="caption">
              This coin has a branch from a laurel tree. It was an important
              symbol for the god Apollo and for the trees that grew in Syria.
            </span>
          </div>
          <span id="intro-style-para">
            On the back, we see the important symbols
          </span>
          <div className="label-image" data-aos="zoom-in">
            <img src={comp_6_right} alt="Logo" className="size-images" />
            <span className="caption">
              On the dime is an olive branch (meaning peace), a lighted torch
              (meaning liberty), and an oak branch (meaning strength).
            </span>
          </div>
        </div>
        <div className="component-7">
          <img src={comp_7_left_mix} alt="Logo" className="size-images-mix" />
          <span id="intro-style-para">
            Just like our coins today, the symbols can change
          </span>
          <img src={comp_7_right_mix} alt="Logo" className="size-images-mix" />
        </div>
        <div className="component-8">
          <h2 data-aos="slide-up">
            The citizens wanted to make sure that everyone knew that these coins
            belonged to them
          </h2>
        </div>
        <div className="component-9">
          <img src={comp_9_left} alt="Logo" className="size-images" />
          <img
            src={comp_9_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            They wrote their name on the coins in Greek: ΑΝΤΙΟΧΕΩΝ, which means
            'Belongs to Antiochians'
          </p>
        </div>
        <div className="component-10">
          <span className="align-subtitle">
            <h2 data-aos="slide-up">
              The name was also important because it made clear the governmental
              authority who gave the cheap bronze value as money.
            </h2>
          </span>
        </div>
        <div className="component-11">
          <img src={comp_11_left} alt="Logo" className="size-images" />
          <img src={comp_11_right} alt="Logo" className="size-images" />
          <p id="intro-style-para">
            We do the same with our money! The term 'United States of America'
            carries a lot of weight!
          </p>
        </div>
        <div className="component-12">
          <img src={comp_12_left} alt="Logo" className="size-images" />
          <img src={comp_12_right} alt="Logo" className="size-images" />
          <p id="intro-style-para">
            Like our U.S. dime, we can tell when a coin was minted or issued
          </p>
        </div>
        <div className="component-13">
          <img
            src={comp_13_left}
            alt="Logo"
            className="size-images"
            data-aos="zoom-in"
          />
          <img
            src={comp_13_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            People of ancient Syria used Greek letters. ΔΡ tells us the coin was
            minted in 55/56 CE, during the reign of emperor Nero.
          </p>
        </div>
        <div className="component-14">
          <img
            src={comp_14_left}
            alt="Logo"
            className="size-images"
            data-aos="zoom-in"
          />
          <img
            src={comp_14_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            The U.S. dime also has other words or legends. They celebrate our
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
          <p id="intro-style-para">
            So did some of the ancient coins!  Here we see  PAX AVGVSTI or
            “Peace of the Emperors” being celebrated!
          </p>
        </div>
        <div className="component-16">
          <img
            src={comp_16_left}
            alt="Logo"
            className="size-images"
            data-aos="zoom-in"
          />
          <img
            src={comp_16_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            The U.S. dime also has what's called a 'mint mark'. The "S" stands
            for the San Francisco mint.
          </p>
        </div>
        <div className="component-17">
          <img
            src={comp_17}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            The ancient coins had mint marks too! Sometimes they stand for the
            minting cities, but it can also indicate a production mark or the
            person who paid for the coins. Sometimes the mark is a mystery!
          </p>
        </div>
        <div className="component-18">
          <img
            src={comp_18_left}
            alt="Logo"
            className="size-images"
            data-aos="zoom-in"
          />
          <img
            src={comp_18_right}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            The U.S. dime tells us its denomination, or how much it is worth.
            One Dime = 10 cents.
          </p>
        </div>
        <div className="component-19">
          <img
            src={comp_19_mix}
            alt="Logo"
            className="size-images-mix"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
            Denomination marks are very rare for ancient Syria. Instead, people
            knew the value based upon a coin’s metal, size, and images.
          </p>
        </div>
        <div className="component-20">
          <img
            src={comp_20}
            alt="Logo"
            className="size-images"
            data-aos="fade-right"
          />
          <p id="intro-style-para">
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
          <p id="intro-style-para" data-aos="fade-right">
            Sometimes, a coin would be cut in half.   We aren’t quite sure why,
            but it likely was an attempt to make more coins when you couldn’t
            mint more.
          </p>
        </div>
        <div className="component-22">
          <Link to="/data-api"> Tell me a Story </Link>
          <h2>
            Overall, there’s so much to explore when it comes to ancient AND
            modern coins. Are you ready to learn more?
          </h2>
          <Link to="/coins"> Explore Coins </Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
