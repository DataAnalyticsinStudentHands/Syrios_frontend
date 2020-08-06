import React from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
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
import boule_edit from "../data/civic-images/boule_edit.png";
import theatre from "../data/civic-images/theatre.png";
import forum from "../data/civic-images/forum.png";
import vote from "../data/civic-images/vote.png";
import festival from "../data/civic-images/festival.png";
import zeus from "../data/civic-images/zeus.png";
import protest from "../data/civic-images/protest.png";
import protest_2 from "../data/civic-images/protest-2.png";
import inscription from "../data/civic-images/inscription.png";

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

  {/* SECTION 1 */}

      <div className="civic-1-head">
        <p id="civic-style-head" data-aos="fade-up">
          This is a <strong>bronze coin</strong> minted by the civic government
          of Antioch for use by the citizens of Antioch.
        </p>
        <img
          src={comp_1}
          alt="Logo"
          className="civic-img-head"
          data-aos="fade-up"
        />
      </div>

      <div className="civic-1-1-up">
        <p id="civic-style-para" data-aos="fade-up">
          Antioch was one of the most important cities of the Roman empire.
          According to the ancient writers Strabo and Josephus, Antioch was
          the third largest city.
        </p>
      </div>

      <div className="civic-1-1">
        <div className="civic-1-1-left" data-aos="fade-right">
          <p id="civic-style-sub">
            “Antioch – the metropolis of Syria, and, without dispute, deserves
            the place of the third city in the habitable earth that was under
            the Roman Empire.”
            <br></br>
            <br></br>
            - Josephus, <em>Wars of the Jews</em> 3.29
          </p>
        </div>
        <div className="civic-1-1-right" data-aos="fade-left">
          <p id="civic-style-sub">
            “Antioch is the metropolis of Syria…and it is does not fall much
            short, either in power or in size, of Seleucia on the Tigris or
            Alexandria in Egypt.”
            <br></br>
            <br></br>
            - Strabo, <em>Geography</em> 16.2
          </p>
        </div>
      </div>

      <div className="civic-1-2">
        <p id="civic-style-para" data-aos="fade-down">
          Antioch compared to Rome was like Chicago is to New York City!
        </p>
      </div>

      <div className="civic-1-3">
        <div id="text-1-3" data-aos="slide-up" >
          But, as big as Antioch grew, it was still a city of citizens.
          <br></br>
          And the coins are an important reminder of this.
        </div>
        <img src={citizens} alt="Logo" />
        <p id="captions" data-aos="fade-down">
          This painting is based upon the <em>Mosaic of a Funerary Symposium </em>
          (late 4th century CE), which was excavated at Antioch and is now at the
          Worcester Art Museum (Object Number: 1936.26)
        </p>
      </div>

  {/* SECTION 2 */}

      <div className="civic-2-head">
        <p id="civic-style-head" data-aos="fade-up">
          On the front of the coins, the citizens wrote their name: ΑΝΤΙΟΧΕΩΝ,
          which means “Belongs to the Antiochians.”
        </p>
        <img
          src={comp_5_left}
          alt="Logo"
          className="civic-img-head"
          data-aos="fade-up"
        />
      </div>

      <div className="civic-2-1">
        <p id="civic-style-para" data-aos="fade-left">
          This name was important because it made clear the governmental authority
          who paid for the coins, minted the coins, and gave the cheap bronze value as money. 
        </p>
      </div>

      <div className="civic-2-2">
        <p id="civic-style-para" data-aos="fade-left">
          It was the citizens of Antioch, and not any Roman emperor. 
        </p>
      </div>

  {/* SECTION 3 */}

      <div className="civic-3-head">
        <p id="civic-style-head" data-aos="fade-up">
          The government also added another message in Greek (just barely
          visible on this worn coin): ΜΗΤΡΟΠΟΛΕΩΣ.
        </p>
        <img
          src={comp_5_right}
          alt="Logo"
          className="civic-img-head"
          data-aos="fade-up"
        />
      </div>

      <div className="civic-3-1">
        <p id="civic-style-para" data-aos="fade-right">
          This means <span id="term">metropolis</span>.
        </p>
      </div>

      <div className="civic-3-2">
        <p id="civic-style-para" data-aos="fade-right">
          This was a special civic status, which emphasized the size, culture, and
          history of the city.
        </p>
      </div>

      <div className="civic-3-3">
        <p id="civic-style-para" data-aos="fade-down">
          The Antiochians were so proud of this special title, they included it
          on their coins for over 300 years!
        </p>
        <div>
          <img
            src={comp_7_1}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="600"
          />
          <img
            src={comp_7_2}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1000"
          />
          <img
            src={comp_7_3}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1400"
          />
          <img
            src={comp_7_4}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="1800"
          />
          <img
            src={comp_7_5}
            alt="Logo"
            data-aos="fade-right"
            data-aos-duration="2200"
          />
        </div>
      </div>

  {/* SECTION 4 */}

      <div className="civic-4-head">
        <p id="civic-style-head" data-aos="fade-left">
          The images on the coins celebrate the local government. Here we see a
          personification of the city’s <span id="term">boule</span> – or council.
        </p>
        <img
          src={boule_edit}
          alt="Logo"
          className="civic-img-head"
          data-aos="fade-up"
        />
      </div>

      <div className="civic-4-1-up">
        <p id="civic-style-para" data-aos="fade-down">
          For example, ancient historians record that the boule gathered the
          <span id="term"> demos</span> – the citizen body – together to debate
          publicly in the city’s theatre.
        </p>
      </div>

      <div className="civic-4-1">
        <img src={theatre} alt="Logo" data-aos="fade-in" />
        <p id="civic-style-sub" data-aos="fade-in">
          "Then the emperor’s lieutenant entered the theatre at Antioch, where
          the people regularly hold their public assemblies, and addressed the
          crowd which hurried there."
          <br></br>
          <br></br>
          -Tacitus, <em>Histories</em> 2.80
        </p>
      </div>

      <div className="civic-4-2">
        <p id="civic-style-para" data-aos="fade-down">
          This is just like the debates and public forums that happen in our own
          local governments!
        </p>
        <img src={forum} alt="Logo" data-aos="fade-in" />
      </div>

      <div className="civic-4-3">
        <img src={boule} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-left">
          Voting was an important job of the boule and demos. The coin even
          shows this! Notice how the boule votes by dropping a pebble into a
          bucket!
        </p>
      </div>

      <div className="civic-4-4">
        <p id="civic-style-para" data-aos="fade-left">
          Just like today, the citizens had a say in the operations of their
          city government!
        </p>
        <img src={vote} alt="Logo" data-aos="fade-right" />
      </div>

      <div className="civic-4-5-up">
        <p id="civic-style-para" data-aos="fade-down">
          The boule and magistrates also hosted many civic celebrations for
          their community.
        </p>
      </div>

      <div className="civic-4-5">
        <div data-aos="fade-in">
          <img src={festival} alt="Logo"/>
          <p id="captions">
            This painting is based upon the <em>Mosaic of Bacchic Dancers </em>
            (2nd cent. CE), which was excavated at Antioch and is now at the Hatay
            Archaeology Museum (Antakya, Hatay Province, Turkey).
          </p>
        </div>
        <p id="civic-style-sub" data-aos="fade-in">
          “The citizens of Antioch, a large and prosperous city, celebrate
          festivals virtually every day of the year in the city and in the
          surrounding area.”
          <br></br>
          <br></br>
          - Herodian, <em>History of the Roman Empire</em> 2.7.9
        </p>
      </div>

      <div className="civic-4-6">
        <img src={zeus} alt="Logo" data-aos="fade-right" />
        <p id="civic-style-para" data-aos="fade-right">
          Many of these civic festivals celebrated the gods. This includes Zeus,
          who is featured on the front of this coin!
        </p>
      </div>

  {/* SECTION 5 */}

      <div className="civic-5-head" >
        <p id="civic-style-head" data-aos="fade-up">
          Finally, the boule could lead the people in protest if they didn’t
          agree with the Roman emperor.
        </p>
      </div>

      <div className="civic-5-1">
        <img src={protest} alt="Logo" data-aos="fade-in"/>
        <p id="civic-style-para" data-aos="fade-up">
          Today, peaceful demonstrations remain an important right of our
          citizens.
        </p>
      </div>

      <div className="civic-5-2-up">
        <p id="civic-style-para" data-aos="fade-up">
          Sometimes, though, the Antiochians could lose the power of their local
          government.
        </p>
      </div>

      <div className="civic-5-2">
        <img src={protest_2} alt="Logo" data-aos="fade-in"/>
        <p id="civic-style-sub" data-aos="fade-in" >
          “The emperor Marcus Aurelius pardoned…the Antiochians, who had said
          many things against Marcus in favor of Cassius, a rival to the throne.
          The emperor had previously taken away their shows and public
          assemblies and every type of meeting, and had issued the harshest
          edict against them.”
          <br></br>
          <br></br>
          - Scriptores Historiae Augustae, <em>Marcus Aurelius</em> 25.8-12
        </p>
      </div>

      <div className="civic-5-3">
        <p id="civic-style-para" data-aos="fade-up">
          This is a major difference between then and now! Even though the local
          government was democratic, the Antiochians lived under the absolute
          rule of the emperor.
        </p>
      </div>

  {/* SECTION 6 */}

      <div className="civic-6-head">
        <p id="civic-style-head" data-aos="fade-up">
          Unfortunately, detailed records for the boule have not survived, so we
          don’t know a lot about the individual officials.
        </p>
      </div>

      <div className="civic-6-1-up">
        <p id="civic-style-para" data-aos="fade-left">
          An inscription from Palmyra does mention the name of one city
          magistrate.
        </p>
      </div>

      <div className="civic-6-1">
        <img src={inscription} alt="Logo" data-aos="fade-down" />
        <div>
        <p id="civic-style-sub" data-aos="fade-up">
          "Marcus Aemilius Marcianus Asclepiades, the bouleutes of
          the Antiochians."
          <br></br><br></br>
          This man also worked as a tax-collector for the Romans.
          <br></br><br></br>
          Notice how this inscription is written in both Greek (top) and Palmyrene,
          a local Syrian language (bottom).
          <br></br>
        </p>
        </div>
      </div>

  {/* SECTION 7 */}

      <div className="civic-7-1">
        <Link to="/tableau-maps" id="civic-intro-style-footer" data-aos="fade-right">
          Where did the civic coins move?
        </Link>
        <Link to="/select-story" id="civic-intro-style-footer" data-aos="fade-left">
          Tell me another story!
        </Link>
      </div>
      <div className="civic-7-2">
        <p id="civic-style-para" data-aos="fade-left">
          Because so few records have survived, our ancient coin is a very
          important reminder of the local government who minted it and the local
          citizens who used it.
        </p>
      </div>

      <div className="civic-resources">
          <p id="religious-style-rsrc">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507493h.r=Hadrian%20Hadrian?rk=515024;0" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 430</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1948.19.1983" target="_blank" rel="noopener noreferrer">American Numismatic Society 1948.19.1983</a></li>
                <br></br>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b85073668.r=Auguste%20Auguste?rk=193134;0" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Fonds général 122</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1944.100.65906" target="_blank" rel="noopener noreferrer">American Numismatic Society - 1944.100.65906</a></li>
                <br></br>
              <li><a href="https://ikmk.smb.museum/object?lang=en&id=18257614" target="_blank" rel="noopener noreferrer">Münzkabinet, Staatliche Museen zu Berlin, 18257614; photograph by Bernhard Weisser</a></li>
            </ul>
            <br></br>
            <br></br>
            To read more, check these out:
            <br></br>
            <br></br>
            <ul>
              <li>
                Butcher, K. 2003. <em>Roman Syria and the Near East</em>.
                Los Angeles: J. Paul Getty Museum.
              </li>
                <br></br>
              <li>
                Harl, K.W. 1987. <em>Civic Coins and Civic Politics in the Roman
                East, A.D. 180-275</em>. Berkeley: University of California Press.
              </li>
                <br></br>
              <li>
                Noreña, C.F. 2016. "Heritage and Homogeneity: The Civic Coinage
                of Roman Antioch," in S. Alcock, M. Egri, and J. Frakes (eds.),
                <em> Beyond Boundaries: Connecting Visual Cultures in the Provinces
                of Ancient Rome</em>. Los Angeles: Getty Publications. 294-306.
              </li>
                <br></br>
              <li>
                Yon, J.-B. 2012. <em>Inscriptions grecques et latines de la Syrie,
                XVII/1: Palmyre</em>. Beirut: Presses de l’IFPO, 191-192, no. 196
              </li>
            </ul>
          </p>
      </div>
    </div>
  );
};

export default civicStory;
