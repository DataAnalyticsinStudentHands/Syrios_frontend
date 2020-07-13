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


      <div className="religious-component-1">
        <p id="religious-style-para" data-aos="fade-left">
          This is the Greek god Zeus.
        </p>
        <img
          src={zeus_coin}
          alt="Logo"
          data-aos="fade-right"
        />
      </div>


      <div className="religious-component-2">
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


      <div className="religious-component-3">
        <p id="religious-style-para" data-aos="fade-right">
          ...and he was a god for the Hellenistic kings.
        </p>
      </div>


      <div className="religious-component-4">
      <p id="religious-style-para" data-aos="fade-down">
      The kings of the Seleucid Empire especially thought of Zeus as their special protector.
      </p>
      </div>


      <div className="religious-component-5-up">
        <p id="religious-style-para" data-aos="fade-left">
          This is one of the reasons the kings featured Zeus on their royal coins.
        </p>
      </div>


      <div className="religious-component-5">
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img src={zeus_hl_coin2} alt="Logo" />
        </div>
        <p id="religious-style-para-blue" data-aos="fade-left">
          In this coin, we see Zeus Nicephorus – he actually carries Victory in his
          hand as he sits on a throne. This type was used over and over again. ​
        </p>
      </div>


      <div className="religious-component-6-up">
        <p id="religious-style-para" data-aos="fade-left">
          According to legend, Zeus helped King Seleucus I decide where to build Antioch.​
        </p>
      </div>


      <div className="religious-component-6">
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img src={eagle} alt="Logo" />
        </div>
        <p id="religious-style-para-blue" data-aos="fade-left" style={{width: "550px", height:"350px", padding:"40px"}}>
        Seleucus offered sacrifice to the gods by burning a slain bull on an altar.
        And Zeus sent down his eagle, who grabbed one of the bull thighs and flew away.
        Seleucus sent his son to follow the bird. Eventually, the eagle dropped the sacrificial meat.
        The king knew that Zeus wanted him to build the city in that place. ​

        -Libanius Or. 11.84 (adapted)
        </p>
      </div>


      <div className="religious-component-7">
        <p id="religious-style-para" data-aos="fade-down">
          After establishing Antioch, the kings continued to celebrate Zeus.
        </p>
      </div>


      <div className="religious-component-8">
        <p id="religious-style-para" data-aos="fade-left">
          King Antiochus IV especially revered Zeus.​
        </p>
      </div>


      <div className="religious-component-9-up">
        <p id="religious-style-para" data-aos="fade-left" style={{width:"800px"}}>
          He contributed to a building of a temple to Zeus in Athens. ​
        </p>
      </div>


      <div className="religious-component-9">
        <p id="religious-style-para-blue" data-aos="fade-left" style={{width:"500px",padding:"20px"}}>
          “Truly, Antiochus IV’s magnificence towards the gods is evidenced by the temple
          to [Zeus Olympius] at Athens, the only one in the whole world which begins to
          capture the greatness of the god.”​
          <br></br>
          –Livy 41.20
        </p>
        <div className="religious-comp-5-left" data-aos="fade-right">
          <img src={temple_1} alt="Logo" />
        </div>
      </div>


      <div className="religious-component-10-up">
        <p id="religious-style-para" data-aos="fade-down">
          He also promised to build another temple to Zeus – (a.k.a. Jupiter) – in Antioch.
        </p>
      </div>


      <div className="religious-component-10">
        <img src={temple_2} alt="Logo" data-aos="fade-in" />
        <p id="religious-style-para-blue" data-aos="fade-in" style={{width:'400px', height:'320px', padding:'40px'}}>
        “At Antioch he projected a magnificent temple to Jupiter Capitolinus, of which
        not only the ceiling was to be overlaid with gold, but the whole of the walls were
        to be covered with gold leaf.”​
        -Livy 41.20
        </p>
      </div>


      <div className="religious-component-11">
      <p id="religious-style-para" data-aos="fade-down">
        We aren’t sure if he ever finished this temple – or even started it – but we
        DO know that he added new images of Zeus to the coins.
      </p>
      </div>


      <div className="religious-component-12">
        <img src={zeus_coin2} alt="Logo" data-aos="fade-right" />
        <p id="religious-style-para" data-aos="fade-left">
          On the <span style={{fontWeight:'bolder', fontStyle:"italic"}}>obverse</span> of this bronze coin is the head of Zeus.
        </p>


      </div>


      <div className="religious-component-13">
        <p id="religious-style-para" data-aos="fade-left">
          On the <span style={{fontWeight:'bolder', fontStyle:"italic"}}>reverse</span> of this coin, we see Zeus’ eagle. In its talons is a lightning bolt.
        </p>
        <img src={zeus_coin3} alt="Logo" data-aos="fade-right" />
      </div>


      <div className="religious-component-14">
        <p id="religious-style-para-blue" data-aos="fade-in" style={{width:'300px', padding:'20px'}}>
          The Homeric poems refer to Zeus as “the gatherer of clouds,” “god of thunder,” and “god of lightning.” ​
        </p>
        <p id="religious-style-para" data-aos="fade-down">
          The lightning bolt reflects Zeus’ control over the weather.​
        </p>
      </div>


      <div className="religious-component-15">
        <p id="religious-style-para" data-aos="fade-right">
          In fact, many coins minted at Antioch feature a lightning bolt to refer to Zeus.
          This symbol is one of Zeus’ <span style={{fontWeight:'bolder', fontStyle:"italic"}}>attributes</span>. ​
        </p>
        <img src={zeus_coin4} alt="Logo" data-aos="fade-right" />
      </div>


      <div className="religious-component-16">
        <p id="religious-style-para" data-aos="fade-down">
          But Zeus was not only a god for the kings. He was a god for the people too.​
        </p>
      </div>


      <div className="religious-component-17">
        <div>
          <img src={zeus_coin5} alt="Logo" data-aos="fade-right" />
          <p id="religious-style-para-blue" data-aos="fade-right" style={{width: '400px'}}>
            A much later silver tridrachm possibly minted at Rome for Syria (c. 98 CE)
            features such a Zeus combined with a local god.  ​
          </p>
        </div>
        <p id="religious-style-para" data-aos="fade-up">
          The people of wider Syria sometimes identified Zeus with their regional
          gods, like Baalshamin (‘Lord of Heaven’) or Hadad (a bringer of storms).
        </p>
      </div>


      <div className="religious-component-18">
        <p id="religious-style-para" data-aos="fade-up">
          This is called <span style={{fontWeight:'bolder', fontStyle:"italic"}}>syncretism</span>,
          where belief systems are blended together. ​
        </p>
      </div>


      <div className="religious-component-19">
        <p id="religious-style-para" data-aos="fade-left">
          The people of Antioch in particular also worshipped Zeus. Our best evidence
          comes from their civic coins. ​
        </p>
      </div>


      <div className="religious-component-20-up">
        <p id="religious-style-para" data-aos="fade-up" style={{width:'600px'}}>
          The very first coins minted by the citizens under Seleucus I feature Zeus and a
          lightning bolt, plus the name of the Antiochians. ​
        </p>
      </div>


      <div className="religious-component-20">
          <img src={zeus_coin6} alt="Logo" data-aos="fade-down" />
          <img src={zeus_coin7} alt="Logo" data-aos="fade-down" />
      </div>


      <div className="religious-component-21">
        <p id="religious-style-para" data-aos="fade-right">
          Later on, when Antiochus IV ruled, the Antiochians featured a standing Zeus
          alongside their name.​ ​
        </p>
        <img src={zeus_coin8} alt="Logo" data-aos="fade-right" />
      </div>


      <div className="religious-component-22-up">
        <p id="religious-style-para" data-aos="fade-right">
          The citizens continued using Zeus on their coins, even after the Seleucid
          kings fell and the Romans conquered Syria. ​​
        </p>
      </div>


      <div className="religious-component-22">
        <img src={zeus_coin9} alt="Logo" data-aos="fade-right" />
        <img src={zeus_coin10} alt="Logo" data-aos="fade-right" />
      </div>


      <div className="religious-component-23">
          <p id="religious-style-para" data-aos="fade-up">
            There are economic reasons for continuing the same coin types as the
            Seleucid kings, but this also reflects the importance of Zeus to the
            citizens themselves. ​
          </p>
      </div>


      <div className="religious-component-24">
        <Link to="/tableau-maps" id="civic-intro-style-footer" data-aos="fade-right">
          Where did the civic coins move?
        </Link>
        <Link to="/select-story" id="civic-intro-style-footer" data-aos="fade-left">
          Tell me another story!
        </Link>
      </div>

    </div>
  );
};

export default religiousStory;
