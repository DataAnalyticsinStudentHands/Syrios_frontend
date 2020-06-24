import React from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
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
import boule from "../data/civic-images/boule.png";
import council from "../data/civic-images/council.png";
import theatre from "../data/civic-images/theatre.png";
import forum from "../data/civic-images/forum.png";
import vote from "../data/civic-images/vote.png";
import festival from "../data/civic-images/festival.png";
import zeus from "../data/civic-images/zeus.png";
import protest from "../data/civic-images/protest.png";
import protest_2 from "../data/civic-images/protest-2.png";
import inscription from "../data/civic-images/inscription.png";
// import ancient_coin from "../data/civic-images/ancient-coin.png";

const civicStory = () => {
  AOS.init({
    duration: 1000,
  });

  return (
    <div className="class-civic-story">
      <div className="class-civic-title">
        <p data-aos="slide-right">The</p>
        <h1 data-aos="slide-left" data-aos-mirror="true">
          CIVIC
        </h1>
        <p data-aos="slide-up">Story</p>
      </div>
      <div className="civic-component-1">
        <img
          src={comp_1}
          alt="Logo"
          className="civic-size-images"
          data-aos="fade-right"
        />
        <p id="civic-style-para" data-aos="fade-left">
          This is a <strong>bronze coin</strong> minted by the civic government
          of Antioch for use by the citizens of Antioch.
        </p>
      </div>
      <div className="civic-component-2">
        <div className="civic-comp-2-left" data-aos="fade-right">
          <p>
            “Antioch – the metropolis of Syria, and, without dispute, deserves
            the place of the third city in the habitable earth that was under
            the Roman Empire.” Josephus, Wars of the Jews 3.29
          </p>
        </div>
        <div
          data-aos="fade-down"
          style={{ fontFamily: "cartogothic_stdbook_bold" }}
          className="civic-comp-2-center"
        >
          <p>
            Antioch was one of the most important cities of the Roman empire.
            According to the ancient writers Strabo and Josephus, Antioch was
            the third largest city.
          </p>
        </div>
        <div className="civic-comp-2-right" data-aos="fade-left">
          <p>
            “Antioch is the metropolis of Syria…and it is does not fall much
            short, either in power or in size, of Seleucia on the Tigris or
            Alexandria in Egypt.” Strabo, Geography 16.2
          </p>
        </div>
      </div>
      <div className="civic-component-3">
        <p id="civic-style-para" data-aos="fade-down">
          Antioch compared to Rome was like Chicago is to New York City!
        </p>
      </div>
      <div className="civic-component-4">
        <div
          style={{ backgroundColor: "#2d616a", padding: "10px" }}
          data-aos="slide-up"
        >
          But, as big as Antioch grew, it was still a city of citizens.
          <br></br>
          And the coins are an important reminder of this.
        </div>
        <img src={citizens} alt="Logo" />
      </div>
      <div className="civic-component-5">
        <div className="civic-comp-5-left" data-aos="fade-right">
          <img src={comp_5_left} alt="Logo" />
        </div>
        <p id="civic-style-para" data-aos="fade-left">
          On the front of the coins, the citizens wrote their name: ΑΝΤΙΟΧΕΩΝ,
          which means “Belongs to the Antiochians.”
        </p>
      </div>
      <div className="civic-component-6">
        <p id="civic-style-para" data-aos="fade-right">
          The government also added another message in Greek (just barely
          visible on this worn coin): MHTROPOLEWS. This means <span style={{backgroundColor:'#ffff00', fontWeight:'bolder', textDecorationLine:'underline'}}>metropolis</span>. This
          was a special civic status, which emphasized the size, culture, and
          history of the city.
        </p>
        <img src={comp_5_right} alt="Logo" data-aos="fade-left"/>
      </div>
      <div className="civic-component-7">
        <p id="civic-style-para" data-aos="fade-down">
          The Antiochians were so proud of this special title, they included it
          on their coins for over 300 years!
        </p>
        <div>
          <img
            src={comp_7_1}
            alt="Logo"
            id="comp-7-1"
            data-aos="fade-right"
            data-aos-duration="600"
          />
          <img
            src={comp_7_2}
            alt="Logo"
            id="comp-7-2"
            data-aos="fade-right"
            data-aos-duration="1000"
          />
          <img
            src={comp_7_3}
            alt="Logo"
            id="comp-7-3"
            data-aos="fade-right"
            data-aos-duration="1400"
          />
          <img
            src={comp_7_4}
            alt="Logo"
            id="comp-7-4"
            data-aos="fade-right"
            data-aos-duration="1800"
          />
          <img
            src={comp_7_5}
            alt="Logo"
            id="comp-7-5"
            data-aos="fade-right"
            data-aos-duration="2200"
          />
        </div>
      </div>
      <div className="civic-component-8">
        <img src={boule} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-left">
          The images on the coins celebrate the local government. Here we see a
          personification of the city’s <span style={{fontWeight:'bolder', textDecorationLine:'underline'}}>boule</span> – or council.
        </p>
      </div>
      <div className="civic-component-9">
        <p id="civic-style-para-blue" data-aos="fade-down">
          The boule was like our own local government and city councils.
        </p>
        <img src={council} alt="Logo" data-aos="fade-in" />
      </div>
      <div className="civic-component-10">
        <p id="civic-style-para" data-aos="fade-down">
          For example, ancient historians record that the boule gathered the <span style={{fontWeight:'bolder', textDecorationLine:'underline'}}>demos</span> – the citizen body – together to debate publicly in the city’s
          theatre.
        </p>
        <img src={theatre} alt="Logo" data-aos="fade-in" />
        <p id="civic-style-para-blue" data-aos="fade-in">
          "Then the emperor’s lieutenant entered the theatre at Antioch, where
          the people regularly hold their public assemblies, and addressed the
          crowd which hurried there." -Tacitus, <span style={{fontStyle:"italic"}}>Histories</span> 2.80
        </p>
      </div>
      <div className="civic-component-11">
        <p id="civic-style-para-blue" data-aos="fade-down">
          This is just like the debates and public forums that happen in our own
          local governments!
        </p>
        <img src={forum} alt="Logo" data-aos="fade-in" />
      </div>
      <div className="civic-component-12">
        <img src={boule} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-left">
          Voting was an important job of the boule and demos. The coin even
          shows this! Notice how the boule votes by dropping a pebble into a
          bucket!
        </p>
      </div>
      <div className="civic-component-13">
        <p id="civic-style-para" data-aos="fade-left">
          Just like today, the citizens had a say in the operations of their
          city government!
        </p>
        <img src={vote} alt="Logo" data-aos="fade-right" />
      </div>
      <div className="civic-component-14">
        <p id="civic-style-para" data-aos="fade-down">
          The boule and magistrates also hosted many civic celebrations for
          their community.
        </p>
        <img src={festival} alt="Logo" data-aos="fade-in"/>
        <p id="civic-style-para-blue" data-aos="fade-in">
          “The citizens of Antioch, a large and prosperous city, celebrate
          festivals virtually every day of the year in the city and in the
          surrounding area.” Herodian, <span style={{fontStyle:"italic"}}>History of the Roman Empire</span> 2.7.9
        </p>
      </div>
      <div className="civic-component-15">
        <img src={zeus} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-left">
          Many of these civic festivals celebrated the gods. This includes Zeus,
          who is featured on the front of this coin!
        </p>
      </div>
      <div className="civic-component-16">
        <p id="civic-style-para" data-aos="fade-down">
          Finally, the boule could lead the people in protest if they didn’t
          agree with the Roman emperor.
        </p>
        <img src={protest} alt="Logo" data-aos="fade-in"/>
        <p id="civic-style-para" data-aos="fade-up">
          Today, peaceful demonstrations remain an important right of our
          citizens.
        </p>
      </div>
      <div className="civic-component-17">
        <p id="civic-style-para" data-aos="fade-up">
          Sometimes, though, the Antiochians could lose the power of their local
          government.
        </p>
        <img src={protest_2} alt="Logo" data-aos="fade-in" style={{width:'600px'}}/>
        <p id="civic-style-para-blue" data-aos="fade-up" style={{width:'600px'}} >
          “The emperor Marcus Aurelius pardoned…the Antiochians, who had said
          many things against Marcus in favor of Cassius, a rival to the throne.
          The emperor had previously taken away their shows and public
          assemblies and every type of meeting, and had issued the harshest
          edict against them.” <br></br>- Scriptores Historiae Augustae, <span style={{fontStyle:"italic"}}>Marcus
          Aurelius</span> 25.8-12
        </p>
      </div>
      <div className="civic-component-18">
        <p id="civic-style-para" data-aos="fade-up">
          This is a major difference between then and now! Even though the local
          government was democratic, the Antiochians lived under the absolute
          rule of the emperor.
        </p>
      </div>
      <div className="civic-component-19">
        <img src={boule} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-left">
          Unfortunately, detailed records for the boule have not survived, so we
          don’t know a lot about the individual officials.
        </p>
      </div>
      <div className="civic-component-20-1">
        <p id="civic-style-para" data-aos="fade-left">
          An inscription from Palmyra does mention the name of one city
          magistrate
        </p>
      </div>
      <div className="civic-component-20">
        <img src={inscription} alt="Logo" data-aos="fade-down" />
        <div style={{margin:'20px'}}>
        <p id="civic-style-para-blue" data-aos="fade-up" style={{width:'600px'}}>
          "Marcus Aemilius Marcianus Asclepiades, the bouleutes of
          the Antiochians."<br></br><br></br>This man also worked as a tax-collector for the Romans.<br></br><br></br>Notice how this inscription is written in both Greek (top) and Palmyrene, a local Syrian language (bottom).
          <br></br>
        </p>
        </div>

      </div>
      <div className="civic-component-21">
        <Link to="/tableau-maps" id="civic-intro-style-footer" data-aos="fade-right">
          Where did the civic coins move?
        </Link>
        <p id="civic-style-para">
          Because so few records have survived, our ancient coin is a very
          important reminder of the local government who minted it and the local
          citizens who used it.
        </p>
        <Link to="/select-story" id="civic-intro-style-footer" data-aos="fade-left">
          Tell me another story!
        </Link>
      </div>
    </div>
  );
};

export default civicStory;
