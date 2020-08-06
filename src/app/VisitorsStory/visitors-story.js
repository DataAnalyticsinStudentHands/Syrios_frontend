import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Tableau1 from "./tableau1";
import Tableau2 from "./tableau2";
import Tableau3 from "./tableau3";
import "tableau-api";
import "./visitors-story.css";
import AOS from "aos";
import antioch from "../data/visitors-images/antioch.png";
import newyork from "../data/visitors-images/newyork.png";
import handcoin from "../data/visitors-images/handcoin.png";
import coin1 from "../data/visitors-images/coin1.png";
import bronzechart from "../data/visitors-images/bronzechart.png";
import nabataea1 from "../data/visitors-images/nabataea1.png";
import nabataea2 from "../data/visitors-images/nabataea2.png";
import petra from "../data/visitors-images/petra.png";
import petra2 from "../data/visitors-images/petra2.png";
import silverdenarii1 from "../data/visitors-images/silverdenarii1.png";
import silverdenarii2 from "../data/visitors-images/silverdenarii2.png";
import romanbronze1 from "../data/visitors-images/romanbronze1.png";
import romanbronze2 from "../data/visitors-images/romanbronze2.png";
import syriacoin1 from "../data/visitors-images/syriacoin1.png";
import syriacoin2 from "../data/visitors-images/syriacoin2.png";
import coinchart from "../data/visitors-images/coinchart.png";
import coinchart1 from "../data/visitors-images/coinchart1.png";
import coinchart2 from "../data/visitors-images/coinchart2.png";


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

const Visitors = () => {
  AOS.init({
    duration: 1000,
    offset: -25,
  });

  return (
    <div className="class-vs-story">
      <div className="class-vs-title">
        <p data-aos="slide-right">A</p>
        <h1 data-aos="slide-left" id="green">
          Visitor's
        </h1>
        <p data-aos="slide-up">Story</p>
        <p data-aos-duration="4000" data-aos="fade-in" id="sub-title">
          the{" "}
          <strong data-aos="fade-in" id="bronze">
            ROMAN
          </strong>{" "}
          period
        </p>
      </div>

  {/* SECTION 1 */}

      <div className="vs-1-head">
        <p id="vs-style-head" data-aos="fade-up">
          In 115 CE, an earthquake struck Antioch.
        </p>
        <img
          src={antioch}
          alt="Logo"
          data-aos="fade-up"
        />
      </div>

      <div className="vs-1-1">
        <p data-aos="fade-in" id="vs-style-para">
          According to the ancient historian Cassius Dio, the disaster hurt visitors
          from all over the Mediterranean and the Middle East.
        </p>
        <p data-aos="fade-in" id="vs-style-sub" style={{width:"600px"}}>
          “And while [the emperor Trajan] was spending time in Antioch, an extraordinary
          earthquake occurred: even though many cities suffered, Antioch was by far
          the most unfortunate. For because Trajan was passing the winter in the city,
          and many soldiers and private individuals from all corners had gathered there
          for legal matters, embassies, commerce, and spectacle, not a single people
          group or land went unharmed – and thus in Antioch, the whole world under
          Roman control was shaken.”
          <br></br>
          <br></br>
          - Cassius Dio 68.24.1-2
        </p>
      </div>

      <div className="vs-1-2">
        <p id="vs-style-para" data-aos="fade-right">
          The damage was like a disaster hitting New York or London during a world summit.
        </p>
        <br></br>
        <img
          src={newyork}
          alt="Logo"
          data-aos="fade-left"
        />
      </div>

      <div className="vs-1-3">
        <p id="vs-style-para" data-aos="fade-down">
          But who were these people?
        </p>
      </div>

  {/* SECTION 2 */}

      <div className="vs-2-head">
        <p id="vs-style-head" data-aos="fade-up">
          The coins excavated at Antioch can give us a sense of who visited the
          city during the Roman period.
        </p>
        <img
          src={handcoin}
          alt="Logo"
          data-aos="fade-up"
        />
      </div>

      <div className="vs-2-1">
        <img
          src={coin1}
          alt="Logo"
          data-aos="fade-in"
          className="vs-size-images"
        />
        <p data-aos="fade-in" id="vs-style-para">
          At Antioch, 960 total identifiable coins were excavated that date to
          the Roman period.
        </p>
      </div>

      <div className="vs-2-2">
        <p data-aos="fade-right" id="vs-style-para">
          949 are bronze and 11 are silver.
        </p>
      </div>

      <div className="vs-2-3">
        <img
          src={bronzechart}
          alt="Logo"
          data-aos="fade-leftt"
          className="vs-size-images"
        />
        <p data-aos="fade-right" id="vs-style-para">
          Of the bronze coins, over 80% were minted within Antioch.
        </p>
      </div>

  {/* SECTION 3 */}

      <div className="vs-3-head">
        <p data-aos="fade-up" id="vs-style-head">
          The rest of the coins come from a scattered mix across the Levant and
          Mediterranean.
        </p>
      </div>

      <div className="vs-3-1">
        <Tableau1 data-aos="fade-in" />
      </div>

      <div className="vs-3-2">
        <p id="vs-style-para" data-aos="fade-left">
          Although we cannot be sure that people from these locations were the
          ones who carried the coins into Antioch, their spread still gives us a
          hint as to who might have been affected by the earthquake.
        </p>
      </div>

      <div className="vs-3-3" >
        <p data-aos="fade-right" id="vs-style-para">
          Still, this isn’t quite the diversity we see at other Syrian sites, such
          as at Dura Europos (a border city under Parthian rule for much of the
          Roman period).
        </p>
        <br></br>
        <Tableau2 data-aos="fade-in" />
      </div>

      <div className="vs-3-4" >
        <p data-aos="fade-left" id="vs-style-para" style={{margin: '60px'}}>
          This may be due to currency regulation at Antioch. In other words, officials
          within the city may have regulated what counted as currency within city limits.
        </p>
      </div>

  {/* SECTION 4 */}

      <div className="vs-4-head">
        <p data-aos="fade-up" id="vs-style-head">
          Even so, the coin assemblage contains important stories about the people
          at Antioch.
        </p>
      </div>

      <div className="vs-4-1">
        <div data-aos="flip-right">
          <img
            src={nabataea1}
            alt="Logo"
            className="vs-size-images"
          />
          <p id="vs-style-sub">
            The obverse shows King Rabbel and his wife, Queen Gamilath.
          </p>
        </div>
        <p id="intro-style-para" data-aos="fade-up">
          For example, 20 coins from the Kingdom of Nabataea were excavated within Antioch.
        </p>
        <div data-aos="flip-left">
          <img
            src={nabataea2}
            alt="Logo"
            className="vs-size-images"
          />
          <p id="intro-style-sub">
            The reverse shows two cornucopiae and a legend in the local language.
          </p>
        </div>
      </div>

      <div className="vs-4-2" >
        <p data-aos="fade-left" id="vs-style-para">
          The Nabataeans are famous for their city of Petra…
        </p>
        <img
          src={petra}
          alt="Logo"
          data-aos="fade-right"
        />
      </div>

      <div className="vs-4-3" >
        <img
          src={petra2}
          alt="Logo"
          data-aos="fade-right"
        />
        <p data-aos="fade-left" id="vs-style-para">
          …and for great wealth due to their trade in luxury goods across ancient Arabia.
        </p>
      </div>

      <div className="vs-4-4" >
        <p data-aos="fade-right" id="vs-style-para">
          Their coins show up even further than their kingdom, testifying to the
          vast trade network and the many interactions along it.
        </p>
        <br></br>
        <Tableau3 data-aos="fade-in" />
      </div>

      <div className="vs-4-5" >
        <p data-aos="fade-right" id="vs-style-para">
          And the people moving in and out of Antioch were a part of this trade network.
        </p>
      </div>

  {/* SECTION 5 */}

      <div className="vs-5-head">
        <p data-aos="fade-up" id="vs-style-head">
          Perhaps the most important story lies in the 102 Roman coins found in
          the city.
        </p>
      </div>

      <div className="vs-5-1-up">
        <p data-aos="fade-right" id="vs-style-para">
          This total includes…
        </p>
      </div>

      <div className="vs-5-1" >
        <div id="vs-5-1" data-aos="fade-right">
          <img
            src={silverdenarii1}
            alt="Logo"
            className='vs-size-img-sm'
          />
          <img
            src={silverdenarii2}
            alt="Logo"
            className="vs-size-img-sm"
          />
          <p id="vs-5-1-sub">
            10 silver denarii
          </p>
        </div>
        <div id="vs-5-1" data-aos="fade-right">
          <img
            src={romanbronze1}
            alt="Logo"
            className="vs-size-img"
          />
          <img
            src={romanbronze2}
            alt="Logo"
            className="vs-size-img"
          />
          <p id="vs-5-1-sub">
            57 imperial Roman bronzes
          </p>
        </div>
        <div id="vs-5-1" data-aos="fade-right">
          <img
            src={syriacoin1}
            alt="Logo"
            className="vs-size-img"
          />
          <img
            src={syriacoin2}
            alt="Logo"
            className="vs-size-img"
          />
          <p id="vs-5-1-sub">
            35 coins minted in Rome specifically for Syria
          </p>
        </div>
      </div>

      <div className="vs-5-2-up">
        <p data-aos="fade-right" id="vs-style-para">
          The coins range in date, but notice how the quantities increase over time.
        </p>
      </div>

      <div className="vs-5-2">
        <img
          src={coinchart1}
          alt="Logo"
          className="vs-size-img-sm"
          data-aos="flip-right"
        />
        <img
          src={coinchart}
          alt="Logo"
          className="vs-5-2-chart"
          data-aos="fade-right"
        />
        <img
          src={coinchart2}
          alt="Logo"
          className="vs-size-img-sm"
          data-aos="flip-left"
        />
      </div>

  {/* SECTION 5 */}

      <div className="vs-6-head">
        <p data-aos="fade-up" id="vs-style-head">
          This makes sense! Like the passage from Cassius Dio showed, Antioch
          became the focus of Roman investment as a political and military center
          during the second century CE.
        </p>
      </div>

      <div className="vs-6-1">
        <p data-aos="fade-right" id="vs-style-para">
          As more Roman officials and soldiers gathered within Antioch, more Roman
          coins traveled along with them into the city.
        </p>
      </div>

      <div className="vs-6-2">
        <p data-aos="fade-right" id="vs-style-para">
          These coins therefore testify to the merging worlds of Antioch and the Roman empire.
        </p>
      </div>

      <div className="vs-6-3">
        <StyledLink to="/tableau-maps" id="vs-button" data-aos="fade-right">
          Where did the civic coins move?
        </StyledLink>
        <StyledLink to="/select-story" id="vs-button" data-aos="fade-left">
          Tell me another story!
        </StyledLink>
      </div>

      <div className="vs-resources">
          <p id="religious-style-rsrc">
            Coin Images Courtesy of:
            <br></br>
            <br></br>
            <ul>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8479972c?rk=1051507;2" target="_blank" rel="noopener noreferrer">Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies, médailles et antiques, Vogüé 227</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/2017.32.62" target="_blank" rel="noopener noreferrer">American Numismatic Society 2017.32.62</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1935.117.369" target="_blank" rel="noopener noreferrer">American Numismatic Society 1935.117.369</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1995.11.491" target="_blank" rel="noopener noreferrer">American Numismatic Society 1995.11.491</a></li>
                <br></br>
              <li><a href="https://gallica.bnf.fr/ark:/12148/btv1b8507176z.r=%22M%205158%22?rk=21459;2" target="_blank" rel="noopener noreferrer">Bibliothèque nationale de France, Département Monnaies, médailles et antiques, M 5158</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1944.100.38396" target="_blank" rel="noopener noreferrer">American Numismatic Society 1944.100.38396</a></li>
                <br></br>
              <li><a href="http://numismatics.org/collection/1956.127.1143" target="_blank" rel="noopener noreferrer">American Numismatic Society 1956.127.1143</a></li>
            </ul>
            <br></br>
            <br></br>
            To read more, check these out:
            <br></br>
            <br></br>
            <ul>
              <li>
                Butcher, K. 2002. “Circulation of Bronze Coinage in the Orontes Valley
                in the Late Hellenistic and Early Roman Periods,” in C. Augé and F.
                Duyrat (eds.), <em>Les monnayages syriens: quel apport pour l'histoire
                du Proche-Orient hellénistique et romain?: actes de la table ronde
                de Damas, 10-12 novembre 1999</em>. Beirut: Institut Français d''Archéologie
                du Proche-Orient. 145-152.
              </li>
                <br></br>
              <li>
                Butcher, K. 2004. <em>Coinage in Roman Syria: Northern Syria, 64
                BC-AD 253</em>. London: Royal Numismatic Society.
              </li>
                <br></br>
              <li>
                Huth, M. and van Alfen, P. G. 2010. <em>Coinage of the Caravan Kingdoms:
                Studies in Ancient Arabian Monetization</em>. New York: American Numismatic Society.
              </li>
                <br></br>
              <li>
                Millar, F. 1993. <em>The Roman Near East, 31 BC-AD 337</em>. Cambridge,
                MA: Harvard University Press
              </li>
                <br></br>
              <li>
                Young, G.K. 2001. <em>Rome’s Eastern Trade: International Commerce
                and Imperial Policy, 31 BC – AD 305</em>. London: Routledge.
              </li>
            </ul>
          </p>
      </div>


    </div>
  );
};

export default Visitors;
