import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  StyledLink,
  StyledLinkButton,
  PageTitle,
  PageSubTitle,
  Level1Text,
  ParaText,
  ParaTextLeft,
  SubText,
  Resources,
} from './componentStyling';
import logo from './data/intro-images/Logo.png';
import bronzecoin from './data/intro-images/bronzecoin.png';
import us_dime from './data/intro-images/us-dime.png';
import comp_3_left from './data/intro-images/comp-3-left.png';
import comp_3_right from './data/intro-images/comp-3-right.png';
import comp_4_left from './data/intro-images/comp-4-left.png';
import comp_4_right from './data/intro-images/comp-4-right.png';
import comp_6_left from './data/intro-images/comp-6-left.png';
import comp_6_right from './data/intro-images/comp-6-right.png';
import comp_9_right from './data/intro-images/comp-9-right.png';
import comp_11_right from './data/intro-images/comp-11-right.png';
import comp_12_right from './data/intro-images/comp-12-right.png';
import comp_13_right from './data/intro-images/comp-13-right.png';
import comp_14_right from './data/intro-images/comp-14-right.png';
import comp_15 from './data/intro-images/comp-15.png';
import comp_16_right from './data/intro-images/comp-16-right.png';
import comp_17 from './data/intro-images/comp-17.png';
import comp_20 from './data/intro-images/comp-20.png';
import comp_21 from './data/intro-images/comp-21.png';
import seleucidTetradrachm from './data/intro-images/seleucidTetradrachm.png';
import romanAureus from './data/intro-images/romanAureus.png';
import usQuarter from './data/intro-images/usQuarter.png';
import euro from './data/intro-images/euro.png';
import syrianProvincial from './data/intro-images/syrianProvincial.png';
import egyptianTetradrachm from './data/intro-images/egyptianTetradrachm.png';
import usStateQuarter from './data/intro-images/usStateQuarter.png';
import germanPfennig from './data/intro-images/germanPfennig.png';
import antiochCoin from './data/intro-images/antiochCoin.png';
import zeugmaCoin from './data/intro-images/zeugmaCoin.png';
import nycFinal from './data/intro-images/nycFinal.png';
import parisCoin from './data/intro-images/parisCoin.png';
import maps from './data/intro-images/maps.png';
import circulationMap from './data/intro-images/circulationMap.png';
import bronze_17mm from './data/intro-images/bronze_17mm.png';
import silver_24mm from './data/intro-images/silver_24mm.png';
import dime_17mm from './data/intro-images/dime_17mm.png';
import quarter_24mm from './data/intro-images/quarter_24mm.png';

const Intro = () => {
  AOS.init({
    duration: 1000,
    offset: -25,
  });

  return (
    <div>
      <div className="container-fluid px-6">
        {/* Page Entry */}
        <div className="row top-buffer-1">
          <div className="col-sm-2"></div>
          <div className="col-sm-3" data-aos="fade-in">
            <img className={'img-responsive'} src={logo} alt="logo" />
          </div>
          <div className="col-sm-1"></div>
          <div className="col-md">
            <div className="row">
              <PageTitle data-aos="fade-in">The SYRIOS Project</PageTitle>
            </div>
            <div className="row mt-md-3">
              <PageSubTitle data-aos="fade-in">
                Studying Urban Relationships and <br />
                Identity over Ancient Syria
              </PageSubTitle>
            </div>
            <div className="row mt-lg-5">
              <div className="row-cols-sm-3 mr-5">
                <StyledLinkButton to="/select-story">Tell Me A Story</StyledLinkButton>
              </div>
              <div className="row-cols-sm-3 ml-5">
                <StyledLinkButton to="/explore">Let Me Explore</StyledLinkButton>
              </div>
            </div>
          </div>
        </div>
        <div className="row top-buffer-1">
          <div className="col-md-6"></div>
          <div className="col-md-2">
            <svg width="30" height="45" xmlns="http://www.w3.org/2000/svg" data-aos="fade-down">
              <g>
                <title>Layer 1</title>
                <line
                  id="svg_1"
                  y2="41"
                  x2="15"
                  y1="0"
                  x1="15"
                  strokeWidth="4"
                  stroke="#17434A"
                  fill="none"
                />
                <line
                  id="svg_2"
                  y2="23.684"
                  x2="27"
                  y1="41"
                  x1="14"
                  strokeWidth="4"
                  stroke="#17434A"
                  fill="none"
                />
                <line
                  id="svg_3"
                  y2="23.684"
                  x2="3"
                  y1="41"
                  x1="16"
                  strokeWidth="4"
                  stroke="#17434A"
                  fill="none"
                />
              </g>
            </svg>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 1.1 */}

        <div className="row top-spacer-2">
          <div className="col-md-3 align-self-center">
            <img src={bronzecoin} alt="Logo" className="size-images-head" data-aos="fade-right" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-8">
            <Level1Text data-aos="fade-left">
              During the time of the Greeks and Romans, many different governments minted their own
              coins within Syria. To learn their stories, we must first learn how to read them.
            </Level1Text>
          </div>
        </div>

        {/* SECTION 1.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={seleucidTetradrachm} alt="Logo" className="size-images-sm" />
              <img src={romanAureus} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>A royal Seleucid tetradrachm and an imperial Roman aureus.</SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-in">
            <ParaText>
              Some of these coins were for kings and emperors. These are like our federal U.S. coins
              or the European Union coins.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={usQuarter} alt="Logo" className="size-images-sm" />
              <img src={euro} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>A U.S. quarter and a 1 Euro coin.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 1.3 3D coin */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center">
            <ParaTextLeft data-aos="fade-left">
              A coin minted for a king celebrates his power and strength.
            </ParaTextLeft>
          </div>
          <div className="col-md-8" data-aos="fade-in">
            <iframe
              title="A 3D model"
              width="640"
              height="480"
              src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed?autostart=1&autospin=0.5&preload=1&amp;ui_controls=1&amp;ui_infos=1&amp;ui_inspector=1&amp;ui_stop=1&amp;ui_watermark=1&amp;ui_watermark_link=1"
              frameBorder="0"
              allow="autoplay; fullscreen"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            ></iframe>
          </div>
        </div>

        {/* SECTION 1.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={syrianProvincial} alt="Logo" className="size-images-sm" />
              <img src={egyptianTetradrachm} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>A Syrian provincial coin and an Egyptian tetradrachm.</SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-in">
            <ParaText>
              Other coins were for provinces or regions. This would be like if the states of America
              minted their own coins.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={usStateQuarter} alt="Logo" className="size-images-sm" />
              <img src={germanPfennig} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>A U.S. state quarter and a 10 German pfennig.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 1.5 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={antiochCoin} alt="Logo" className="size-images-sm" />
              <img src={zeugmaCoin} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>Civic coins from Antioch and Zeugma in Syria.</SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-in">
            <ParaText>
              Many individual cities and peoples in Syria and the Middle East also minted their own
              coins. This is like if New York or Chicago or Paris or London minted their own coins.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={nycFinal} alt="Logo" className="size-images-sm" />
              <img src={parisCoin} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>Imagined civic coins from New York and Paris.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 1.6 Maps */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8" data-aos="fade-right">
            <ParaText>
              All of this minting continued in Syria, even while the region was ruled by the
              Seleucid kings and Roman empire.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div style={{ textAlign: 'center' }}>
              <img src={maps} alt="Logo" data-aos="fade-left" className="img-responsive" />
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 2.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-3 align-self-center" data-aos="fade-right">
            <img src={bronzecoin} alt="Logo" className="size-images-head" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-8 align-self-center">
            <Level1Text data-aos="fade-left">
              Each coin has a lot to say, even the smallest bronze coin.
            </Level1Text>
          </div>
        </div>

        {/* SECTION 2.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="fade-up">
            <div style={{ textAlign: 'center' }}>
              <img src={bronzecoin} alt="Logo" className="size-images" />
            </div>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>In fact, this coin has a lot in common with a U.S. dime.</ParaText>
          </div>
          <div className="col-md-3" data-aos="fade-left">
            <div style={{ textAlign: 'center' }}>
              <img src={us_dime} alt="Logo" className="size-images" />
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        <div className="row top-spacer-4">
          <div className="col-md-4"></div>
          <div className="col-md-4" data-aos="fade-up">
            <ParaText>They are the same size.</ParaText>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 2.3 */}

        <div className="row top-spacer-4">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="fade-right">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_3_left} alt="Logo" className="size-images" />
            </div>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              Like the dime, the little bronze coin has images and writing which form its{' '}
              <span id="term">type</span>.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="fade-left">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_3_right} alt="Logo" className="size-images" />
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 2.4 */}

        <div className="row top-spacer-5">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_4_left} alt="Logo" className="size-images" />
            </div>
            <SubText>
              On the ancient bronze coin is Apollo (the Greek god of archery, music, and light).
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              On the front or <span id="term">obverse</span>, we see the head of an important
              person.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_4_right} alt="Logo" className="size-images" />
              <SubText>On the dime is Franklin D. Roosevelt (the 32nd U.S. President).</SubText>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 2.5 */}

        <div className="row top-spacer-4">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_6_left} alt="Logo" className="size-images" />
            </div>
            <SubText>
              This coin has a branch from a laurel tree. It was an important symbol for the god
              Apollo and for the trees that grew in Syria.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              On the back or <span id="term">reverse</span>, we see important symbols.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_6_right} alt="Logo" className="size-images" />
              <SubText>
                On the dime is an olive branch (meaning peace), a lighted torch (meaning liberty),
                and an oak branch (meaning strength).
              </SubText>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        <div className="row top-spacer-4">
          <div className="col-md-4"></div>
          <div className="col-md-4" data-aos="fade-up">
            <ParaText>
              In addition to symbols, many coins also have <span id="term">legends </span>
              or writing on them.
            </ParaText>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 2.6 */}

        <div className="row top-spacer-4">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_9_right} alt="Logo" className="size-images" />
            </div>
            <SubText>
              This bronze coin has a civic <span id="term">ethnic</span> or name of the citizens in
              Greek. It reads <strong>ANTIOXEΩN</strong>, which means 'Belongs to the Antiochians'.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              Sometimes the <span id="term">legend</span> tells us about the government behind the
              minting of the coin.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_11_right} alt="Logo" className="size-images" />
              <SubText>
                This dime identifies itself as belonging to the United States of
                America.
              </SubText>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 2.7 */}

        <div className="row top-spacer-4">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_15} alt="Logo" className="size-images" />
            </div>
            <SubText>
              This silver radiate celebrates PAX AVGVSTI or “Peace of the
              Emperors.”
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              Sometimes the <span id="term">legend</span> celebrates the government or community
              values.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={comp_14_right} alt="Logo" className="size-images" />
              <SubText>
                This dime celebrates the official national motto and a key value of the United
                States.
              </SubText>
            </div>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 3.0 */}

        <div className="row top-spacer-4">
          <div className="col-md-8">
            <Level1Text data-aos="fade-up">
              With these images and legends, coins made clear which governmental authority gave the
              coins value as money.
            </Level1Text>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 3.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8" data-aos="fade-in">
            <ParaText>
              Because of the uniqueness of each coin and the issuing authority that guaranteed its
              value (e.g., individual cities, provinces, kingdoms, imperial governments), not all
              coins were accepted everywhere as currency.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.2 */}

        <div className="row top-spacer-1">
          <div className="col-md-8">
            <img src={circulationMap} alt="Logo" className="img-responsive" />
          </div>
          <div className="col-md-4 align-self-center">
            <SubText>
              This map shows how the coins of different authorities are believed to have generally
              circulated. Actual evidence, however, shows tremendous variation.
            </SubText>
          </div>
        </div>

        {/* SECTION 3.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8" data-aos="fade-in">
            <ParaText>
              We can use digital technologies to map where, when, and in what quantities each Syrian
              community’s coins appear in the archaeological record. This can help us identify
              regional and empire-wide limits in their movement and in their{' '}
              <span id="term">circulation</span> as money.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 4.0 */}

        <div className="row top-spacer-5">
          <div className="col-md-6">
            <Level1Text data-aos="fade-left">
              The coins have many other features to notice.
            </Level1Text>
          </div>
          <div className="col-md-6"></div>
        </div>

        {/* SECTION 4.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={bronze_17mm} alt="Logo" className="size-images-sm" />
              <img src={silver_24mm} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>
              Denomination marks are very rare for ancient Syria. instead, people knew the value
              based upon a coin’s metal, size, and images.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-in">
            <ParaText>
              The <span id="term">denomination</span> of a coin means how much a coin is worth as
              money.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={dime_17mm} alt="Logo" className="size-images-sm" />
              <img src={quarter_24mm} alt="Logo" className="size-images-sm" />
            </div>
            <SubText>
              Modern coins are different metals and sizes, but they also tell us how much they are
              worth.
            </SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 4.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <img src={comp_13_right} alt="Logo" className="size-images" />
            <SubText>
              Greek letters indicate the date on Syrian coins. The ΔΡ tells us that the coin was
              minted in 55/56 CE, during the reign of emperor Nero.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>Letters and numbers can tell us when a coin was minted.</ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <img src={comp_12_right} alt="Logo" className="size-images" />
            <SubText>This dime was minted in 2013.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 4.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <img src={comp_17} alt="Logo" className="size-images" />
            <SubText>
              Ancient mint marks may indicate the minting city, but it may also be a production mark
              hinting at who paid for the coins or remain a mystery.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-up">
            <ParaText>
              <span id="term">Mint marks</span> are letters or symbols which can indicate where a
              coin was struck.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <img src={comp_16_right} alt="Logo" className="size-images" />
            <SubText>This dime was struck at the San Francisco mint.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 4.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <img src={comp_20} alt="Logo" className="size-images" data-aos="fade-in" />
            <SubText data-aos="fade-down">
              A <span id="term">countermark</span> was stamped on a circulating coin to give it
              extra value or keep it working as money.
            </SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-down">
            <ParaText>And watch out for other marks and modifications to the coins!</ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <img src={comp_21} alt="Logo" className="size-images" data-aos="fade-in" />
            <SubText data-aos="fade-down">
              A coin could be cut in half too, likely as an attempt to make more coins when minting
              stopped.
            </SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 5.0 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8" data-aos="fade-right">
            <ParaText>
              Ancient coins have so much to say, as pieces of art, as objects that move, and as
              representatives of the people who minted and used them. Are you ready to learn more?
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* Bottom Buttons */}

        <div className="row top-spacer-05">
          <div className="col-md-3 offset-3">
            <StyledLinkButton to="/select-story" data-aos="fade-right">
              Tell me a Story
            </StyledLinkButton>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3">
            <StyledLinkButton to="/coins" data-aos="fade-left">
              Explore Coins
            </StyledLinkButton>
          </div>
        </div>
      </div>

      {/* Resources */}

      <Resources>
        <div className="row top-spacer-2"></div>
        <div className="row top-spacer-1">
          <div className="col-md-1"></div>
          <div className="col-md-5">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li>
                <StyledLink
                  href="https://gallica.bnf.fr/ark:/12148/btv1b8507404h.r=Neron%20Neron?rk=150215;2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies,
                  médailles et antiques, Fonds général 180{' '}
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.75243"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1944.100.75243
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.39966"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1944.100.39966
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://ikmk.smb.museum/object?lang=en&id=18215628"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Münzkabinet, Staatliche Museen zu Berlin, 18215628; photograph by Dirk Sonnenwald
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1937.999.318"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1937.999.318
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.65231"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1944.100.65231
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://ikmk.smb.museum/object?id=18201044"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Münzkabinett, Staatliche Museen zu Berlin, 18201044; photograph by Reinhard
                  Saczewski
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1996.71.3?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society - 1996.71.3
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1999.2.2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society - 1999.2.2
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.65544"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society - 1944.100.65544
                </StyledLink>
              </li>
            </ul>
          </div>
          <div className="col-md-5 ">
            To read more, check these out:
            <br></br>
            <br></br>
            <ul>
              <li>
                Burnett, A. 1987. <em>Coinage in the Roman World</em>. London: Seaby.
              </li>
              <br></br>
              <li>
                Butcher, K. 2001-2002. “Small Change in Ancient Beirut: The Coin Finds from BEY 006
                and BEY 045: Persian, Hellenistic, Roman, and Byzantine Periods,” <em>Berytus</em>{' '}
                45-46.
              </li>
              <br></br>
              <li>
                Casey, P.J. 1986. <em>Understanding Ancient Coins</em>. Norman: University of
                Oklahoma Press.
              </li>
              <br></br>
              <li>
                Howgego, C. 1995. <em>Ancient History from Coins</em>. London: Routledge.
              </li>
              <br></br>
              <li>
                Howgego, C., Heuchert, V., and Burnett, A. (eds.) 2005.{' '}
                <em>Coinage and Identity in the Roman Provinces</em>. Oxford University Press.
              </li>
              <br></br>
              <li>
                Metcalf, W.E. (ed.). 2012. <em>The Oxford Handbook of Greek and Roman Coinage</em>.
                Oxford University Press.
              </li>
              <br></br>
              <li>
                Neumann, K. Forthcoming.{' '}
                <em>Antioch in Syria: A History from Coins, 300 BCE-450 CE</em> (Cambridge
                University Press).
              </li>
            </ul>
          </div>
          <div className="col-md-1"></div>
        </div>
        <div className="row top-spacer-1"></div>
      </Resources>
    </div>
  );
};

export default Intro;
