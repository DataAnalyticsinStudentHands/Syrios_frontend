import React from "react";
import AOS from "aos";
// import "aos/dist/aos.css";
import "./civic-story.css";
import comp_1 from "../data/civic-images/comp-1.png";
import comp_5_left from "../data/civic-images/comp-5-left.png";
import comp_5_right from "../data/civic-images/comp-5-right.png";
import comp_7_1 from "../data/civic-images/comp-7-1.png";
import comp_7_2 from "../data/civic-images/comp-7-2.png";
import comp_7_3 from "../data/civic-images/comp-7-3.png";
import comp_7_4 from "../data/civic-images/comp-7-4.png";
import comp_7_5 from "../data/civic-images/comp-7-5.png";
import citizens from "../data/civic-images/citizens.png";

const civicStory = () => {
  AOS.init({
    duration: 2500,
  });

  return (
    <div className="class-civic-story">
      <div className="class-civic-title">
        <h1>This is a civic story!</h1>
      </div>
      <div className="civic-component-1" data-aos="fade-right">
        <img
          src={comp_1}
          alt="Logo"
          className="civic-size-images"
          data-aos="fade-right"
        />
        <span className="civic-align-subtitle">
          This is a bronze coin minted by the civic government of Antioch for
          use by the citizens of Antioch.
        </span>
      </div>
      <div className="civic-component-2">
        <div className="civic-comp-2-left" data-aos="fade-right">
          “Antioch – the metropolis of Syria, and, without dispute, deserves the
          place of the third city in the habitable earth that was under the
          Roman Empire.” Josephus, Wars of the Jews 3.29
        </div>
        <div
          data-aos="fade-in"
          style={{ fontFamily: "cartogothic_stdbook_bold" }}
        >
          Antioch was one of the most important cities of the Roman empire.
          According to the ancient writers Strabo and Josephus, Antioch was the
          third largest city.
        </div>
        <div className="civic-comp-2-right" data-aos="fade-left">
          “Antioch is the metropolis of Syria…and it is does not fall much
          short, either in power or in size, of Seleucia on the Tigris or
          Alexandria in Egypt.” Strabo, Geography 16.2
        </div>
      </div>
      <div className="civic-component-3" data-aos="fade-in">
        Antioch compared to Rome was like Chicago is to New York City!
      </div>
      <div className="civic-component-4" data-aos="fade-in">
        <div style={{backgroundColor:'#2d616a'}} data-aos="slide-up">
          But, as big as Antioch grew, it was still a city of citizens.
          <br></br>
          And the coins are an important reminder of this.
        </div>
        <img src={citizens}/>
      </div>
      <div className="civic-component-5">
        <div className="civic-comp-5-left" data-aos="fade-right">
          <img src={comp_5_left} alt="Logo" />
        </div>
        <div data-aos="fade-in">
          On the front of the coins, the citizens wrote their name: ΑΝΤΙΟΧΕΩΝ,{" "}
          <br></br>
          which means “Belongs to the Antiochians.”
        </div>
        {/* <div className="civic-comp-5-right" data-aos="fade-left">
          <img src={comp_5_right} alt="Logo" />
        </div> */}
      </div>
      <div className="civic-component-6">
        <div data-aos="fade-in">
          The government also added another message in Greek (just barely
          visible on this worn coin): MHTROPOLEWS. This means metropolis. This
          was a special civic status, which emphasized the size, culture, and
          history of the city.
        </div>
        <div className="civic-comp-5-left" data-aos="fade-left">
          <img src={comp_5_right} alt="Logo" />
        </div>
      </div>
      <div className="civic-component-7">
        <div style={{ width: "500px" }} data-aos="fade-in">
          The Antiochians were so proud of this special title, they included it
          on their coins for over 300 years!
        </div>
        <img src={comp_7_1} alt="Logo" id="comp-7-1" data-aos="fade-left" />
        <img src={comp_7_2} alt="Logo" id="comp-7-2" data-aos="fade-right" />
        <img src={comp_7_3} alt="Logo" id="comp-7-3" data-aos="fade-left" />
        <img src={comp_7_4} alt="Logo" id="comp-7-4" data-aos="fade-right" />
        <img src={comp_7_5} alt="Logo" id="comp-7-5" data-aos="fade-left" />
      </div>
    </div>
  );
};

export default civicStory;