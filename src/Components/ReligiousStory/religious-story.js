import React from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
// import "aos/dist/aos.css";
import "./religious-story.css";
import zeus_coin from "../data/religious-images/zeus_coin.png";
import zeus_hl_coin from "../data/religious-images/zeus_hl_coin.png";
import zeus_hl_coin2 from "../data/religious-images/zeus_hl_coin2.png";
import eagle from "../data/religious-images/eagle.png";
import temple_1 from "../data/religious-images/temple_1.png";
import temple_2 from "../data/religious-images/temple_2.png";
import zeus_coin2 from "../data/religious-images/zeus_coin2.png";
import zeus_coin3 from "../data/religious-images/zeus_coin3.png";
import zeus_coin4 from "../data/religious-images/zeus_coin4.png";
import zeus_coin5 from "../data/religious-images/zeus_coin5.png";
import zeus_coin6 from "../data/religious-images/zeus_coin6.png";
import zeus_coin7 from "../data/religious-images/zeus_coin7.png";
import zeus_coin8 from "../data/religious-images/zeus_coin8.png";
import zeus_coin9 from "../data/religious-images/zeus_coin9.png";
import zeus_coin10 from "../data/religious-images/zeus_coin10.png";

const religiousStory = () => {
  AOS.init({
    duration: 1000,
  });

  return (
    <div className="class-religious-story">
      <div className="class-religious-title">
        <p data-aos="slide-right">The</p>
        <h1 data-aos="slide-left" data-aos-mirror="true">
          RELIGIOUS
        </h1>
        <p data-aos="slide-up">Story</p>
      </div>

  {/* SECTION 1 */}

      <div className="religious-1-head" style={{width:"100%", height:"100%"}}>
        <p id="religious-style-head" data-aos="fade-up">
          This is the Greek god Zeus.
        </p>
        <img
          src={zeus_coin}
          alt="Logo"
          className="religious-img-head"
          data-aos="fade-up"
        />
      </div>

      <div className="religious-1-1">
      <img
        src={zeus_hl_coin}
        alt="Logo"
        className="religious-size-images"
        data-aos="fade-right"
      />
      <p id="religious-style-para" data-aos="fade-left">
        He was the king of the Greek gods...
      </p>
      </div>

      <div className="religious-1-2">
        <p id="religious-style-para" data-aos="fade-right">
          ...and he was a god for the Hellenistic kings.
        </p>
      </div>

  {/* SECTION 2 */}

      <div className="religious-2-head" style={{width:"100%", height:"100%"}}>
      <p id="religious-style-head" data-aos="fade-up">
      The kings of the Seleucid Empire especially thought of Zeus as their special protector.
      </p>
      </div>

      <div className="religious-2-1-up">
        <p id="religious-style-para" data-aos="fade-left">
          This is one of the reasons the kings featured Zeus on their royal coins.
        </p>
      </div>

      <div className="religious-2-1">
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img
            src={zeus_hl_coin2}
            alt="Logo"
            className="religious-size-images"
          />
        </div>
        <p id="religious-style-sub" data-aos="fade-left" style={{width: "300px", height:"200px", padding:"40px"}}>
          In this coin, we see Zeus Nicephorus – he actually carries Victory in his
          hand as he sits on a throne. This type was used over and over again. ​
        </p>
      </div>

      <div className="religious-2-2-up">
        <p id="religious-style-para" data-aos="fade-left">
          According to legend, Zeus helped King Seleucus I decide where to build Antioch.​
        </p>
      </div>

      <div className="religious-2-2">
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img
            src={eagle}
            alt="Logo"
          />
        </div>
        <p id="religious-style-sub" data-aos="fade-left" style={{width: "450px", padding:"40px"}}>
        "Seleucus offered sacrifice to the gods by burning a slain bull on an altar.
        And Zeus sent down his eagle, who grabbed one of the bull thighs and flew away.
        Seleucus sent his son to follow the bird. Eventually, the eagle dropped the sacrificial meat.
        The king knew that Zeus wanted him to build the city in that place."
        <br></br>
        <br></br>
        -Libanius Or. 11.84 (adapted)
        </p>
      </div>

      <div className="religious-2-3">
        <p id="religious-style-para" data-aos="fade-down">
          After establishing Antioch, the kings continued to celebrate Zeus.
        </p>
      </div>

  {/* SECTION 3 */}

      <div className="religious-3-head" style={{width:"100%", height:"100%"}}>
        <p id="religious-style-head" data-aos="fade-left">
          King Antiochus IV especially revered Zeus.​
        </p>
      </div>

      <div className="religious-3-1-up">
        <p id="religious-style-para" data-aos="fade-left" style={{width:"800px"}}>
          He contributed to a building of a temple to Zeus in Athens. ​
        </p>
      </div>

      <div className="religious-3-1">
        <p id="religious-style-sub" data-aos="fade-left" style={{width:"500px",padding:"40px"}}>
          “Truly, Antiochus IV’s magnificence towards the gods is evidenced by the temple
          to [Zeus Olympius] at Athens, the only one in the whole world which begins to
          capture the greatness of the god.”​
          <br></br>
          <br></br>
          –Livy 41.20
        </p>
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img
            src={temple_1}
            alt="Logo"
          />
        </div>
      </div>

      <div className="religious-3-2-up">
        <p id="religious-style-para" data-aos="fade-down">
          He also promised to build another temple to Zeus – (a.k.a. Jupiter) – in Antioch.
        </p>
      </div>

      <div className="religious-3-2">
        <img src={temple_2} alt="Logo" data-aos="fade-in" />
        <p id="religious-style-sub" data-aos="fade-in" style={{width:'500px', padding:'40px'}}>
        “At Antioch he projected a magnificent temple to Jupiter Capitolinus, of which
        not only the ceiling was to be overlaid with gold, but the whole of the walls were
        to be covered with gold leaf.”​
        <br></br>
        <br></br>
        -Livy 41.20
        </p>
      </div>

      <div className="religious-3-3">
      <p id="religious-style-para" data-aos="fade-down">
        We aren’t sure if he ever finished this temple – or even started it – but we
        DO know that he added new images of Zeus to the coins.
      </p>
      </div>

      <div className="religious-3-4">
        <img
          src={zeus_coin2}
          alt="Logo"
          data-aos="fade-right"
          className="religious-size-images"
        />
        <p id="religious-style-para" data-aos="fade-left">
          On the <span style={{fontWeight:'bolder', fontStyle:"italic"}}>obverse</span> of this bronze coin is the head of Zeus.
        </p>
      </div>

      <div className="religious-3-5">
        <p id="religious-style-para" data-aos="fade-left">
          On the <span style={{fontWeight:'bolder', fontStyle:"italic"}}>reverse</span> of this coin, we see Zeus’ eagle. In its talons is a lightning bolt.
        </p>
        <img
          src={zeus_coin3}
          alt="Logo"
          className="religious-size-images"
          data-aos="fade-right"
        />
      </div>

      <div className="religious-3-6">
        <p id="religious-style-para" data-aos="fade-down">
          The lightning bolt reflects Zeus’ control over the weather.​
        </p>
        <p id="religious-style-sub" data-aos="fade-in" style={{width:'400px', padding:'40px'}}>
          The Homeric poems refer to Zeus as “the gatherer of clouds,” “god of thunder,” and “god of lightning.” ​
        </p>
      </div>

      <div className="religious-3-7">
        <p id="religious-style-para" data-aos="fade-right">
          In fact, many coins minted at Antioch feature a lightning bolt to refer to Zeus.
          This symbol is one of Zeus’ <span style={{fontWeight:'bolder', fontStyle:"italic"}}>attributes</span>. ​
        </p>
        <img
          src={zeus_coin4}
          alt="Logo"
          className="religious-size-images"
          data-aos="fade-right"
        />
      </div>

  {/* SECTION 4 */}

      <div className="religious-4-head" style={{width:"100%", height:"100%"}}>
        <p id="religious-style-head" data-aos="fade-down">
          But Zeus was not only a god for the kings. He was a god for the people too.​
        </p>
      </div>

      <div className="religious-4-1">
        <div>
          <img
            src={zeus_coin5}
            alt="Logo"
            className="religious-size-images"
            data-aos="fade-right" />
          <p id="religious-style-sub" data-aos="fade-right" style={{width: "300px", padding:"40px"}}>
            A much later silver tridrachm possibly minted at Rome for Syria (c. 98 CE)
            features such a Zeus combined with a local god.  ​
          </p>
        </div>
        <p id="religious-style-para" data-aos="fade-up">
          The people of wider Syria sometimes identified Zeus with their regional
          gods, like Baalshamin (‘Lord of Heaven’) or Hadad (a bringer of storms).
        </p>
      </div>

      <div className="religious-4-2">
        <p id="religious-style-para" data-aos="fade-up">
          This is called <span style={{fontWeight:'bolder', fontStyle:"italic"}}>syncretism</span>,
          where belief systems are blended together. ​
        </p>
      </div>

  {/* SECTION 5 */}

      <div className="religious-5-head" style={{width:"100%", height:"100%"}}>
        <p id="religious-style-head" data-aos="fade-left">
          The people of Antioch in particular also worshipped Zeus. Our best evidence
          comes from their civic coins. ​
        </p>
      </div>

      <div className="religious-5-1-up">
        <p id="religious-style-para" data-aos="fade-up" style={{width:'600px'}}>
          The very first coins minted by the citizens under Seleucus I feature Zeus and a
          lightning bolt, plus the name of the Antiochians. ​
        </p>
      </div>

      <div className="religious-5-1">
          <img
            src={zeus_coin6}
            alt="Logo"
            data-aos="fade-down"
            className="religious-size-images"
          />
          <img
            src={zeus_coin7}
            alt="Logo"
            data-aos="fade-down"
            className="religious-size-images"
          />
      </div>

      <div className="religious-5-2">
        <p id="religious-style-para" data-aos="fade-right">
          Later on, when Antiochus IV ruled, the Antiochians featured a standing Zeus
          alongside their name.​ ​
        </p>
        <img
          src={zeus_coin8}
          alt="Logo"
          data-aos="fade-right"
          className="religious-size-images"
        />
      </div>

      <div className="religious-5-3-up">
        <p id="religious-style-para" data-aos="fade-right">
          The citizens continued using Zeus on their coins, even after the Seleucid
          kings fell and the Romans conquered Syria. ​​
        </p>
      </div>

      <div className="religious-5-3">
        <img
          src={zeus_coin9}
          alt="Logo"
          data-aos="fade-right"
          className="religious-size-images"
        />
        <img
          src={zeus_coin10}
          alt="Logo"
          data-aos="fade-right"
          className="religious-size-images"
        />
      </div>

  {/* SECTION 6 */}

      <div className="religious-6-1">
          <p id="religious-style-para" data-aos="fade-up">
            There are economic reasons for continuing the same coin types as the
            Seleucid kings, but this also reflects the importance of Zeus to the
            citizens themselves. ​
          </p>
      </div>

      <div className="religious-6-2">
        <Link to="/tableau-maps" id="civic-intro-style-footer" data-aos="fade-right">
          Where did the civic coins move?
        </Link>
        <Link to="/select-story" id="civic-intro-style-footer" data-aos="fade-left">
          Tell me another story!
        </Link>
      </div>

      <div className="religious-resources" style={{width:"100%", height:"100%"}}>
          <p id="religious-style-rsrc">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b85678605" target="_blank">Bibliothèque nationale de France, département Monnaies, médailles et antiques, C 2089</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1948.19.2338" target="_blank">American Numismatic Society 1948.19.2338</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1953.171.1677" target="_blank">American Numismatic Society 1953.171.1677</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1948.19.1983" target="_blank">American Numismatic Society 1948.19.1983</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1944.100.75011" target="_blank">American Numismatic Society 1944.100.75011 </a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1967.152.609?lang=en" target="_blank">American Numismatic Society - 1967.152.609 </a></li>
            </ul>
            <br></br>
            <br></br>
            To read more, check these out:
            <br></br>
            <br></br>
            <ul>
              <li>Nicholas Wright, “Seleucid Royal Cult, Indigenous Religious Traditions, and Radiate Crowns: The Numismatic Evidence,” <span style={{fontStyle:"italic"}}>Mediterranean Archaeology</span> 18 (2005), 67-82.</li>
                <br></br>
              <li>Nicholas Wright, “Non-Greek Religious Imagery on the Coinage of Seleucid Syria,” <span style={{fontStyle:"italic"}}>Mediterranean Archaeology</span> 22/23 (2009/10), 193-206.</li>
                <br></br>
              <li>Kent J. Rigsby, “Seleucid Notes,” <span style={{fontStyle:"italic"}}>Transactions of the American Philological Association</span> 110 (1980), 233-254.</li>
                <br></br>
              <li><a href="https://journals.openedition.org/syria/344?lang=en" target="_blank">Kevin Butcher, “Two Syrian Deities,” <span style={{fontStyle:"italic"}}>Syria</span> 84 (2007)</a></li>
            </ul>
          </p>
      </div>

    </div>
  );
};

export default religiousStory;
