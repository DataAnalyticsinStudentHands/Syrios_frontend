import React from 'react';
import 'tableau-api';
import TableauReport from "tableau-react";
import {
  StyledLink,
  StyledLinkButton,
  StoryTitle,
  StoryTitleSM,
  Level1Text,
  ParaText,
  ParaTextLeft,
  SubText,
  Captions,
  Resources,
} from './componentStyling';
import AOS from 'aos';
import 'aos/dist/aos.css';
import bronze from './data/economic-images/bronze-coin.png';
import silver from './data/economic-images/silver-coin.png';
import bronze_caption from './data/economic-images/bronze-coin-caption.png';
import silver_caption from './data/economic-images/silver-coin-caption.png';
import gold_caption from './data/economic-images/gold-coin-caption.png';
import people from './data/economic-images/people.png';
import equal_to from './data/economic-images/equal-to.png';
import bread from './data/economic-images/bread.png';
import jug from './data/economic-images/jug.png';
import milk from './data/economic-images/milk.png';
import citycoin1 from './data/economic-images/citycoin1.png';
import citycoin2 from './data/economic-images/citycoin2.png';

const Tableau = props => (
    <TableauReport
        url="https://public.tableau.com/views/CivicCoinMap/Sheet1?:display_count=n&:origin=viz_share_link"
        // token="<TRUSTED TICKET HERE>"
    />
)

const Economic = () => {
  AOS.init({
    duration: 1000,
    offset: 100,
  });

  return (
    <div>
      <div className="container-fluid px-6">
        {/* Page Entry */}

        <div className="row top-buffer-2">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <StoryTitleSM data-aos="slide-right">The</StoryTitleSM>
            <StoryTitle data-aos="slide-left">ECONOMIC</StoryTitle>
            <StoryTitleSM data-aos="slide-up">Story</StoryTitleSM>
          </div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <StoryTitleSM data-aos="slide-right">
              a <span id="yellow"> BRONZE </span> coin
            </StoryTitleSM>
          </div>
        </div>

        {/* SECTION 1.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-7 align-self-center">
            <Level1Text data-aos="fade-left">This is a bronze coin.</Level1Text>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <img src={bronze} alt="Logo" className="size-images-head" data-aos="fade-in" />
          </div>
        </div>

        {/* SECTION 1.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-6 align-self-center" style={{ textAlign: 'center' }}>
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1100"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1200"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1300"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1400"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1500"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1600"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1700"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1800"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-right"
              data-aos-duration="1900"
              className="size-images-50"
            />
            <br></br>
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2000"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2100"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2200"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2300"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2400"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2500"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2600"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2700"
              className="size-images-50"
            />
            <img
              src={bronze}
              alt="Logo"
              data-aos="fade-down"
              data-aos-duration="2800"
              className="size-images-50"
            />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center">
            <ParaTextLeft data-aos="fade-left">
              A regular person working on a farm or in a shop would earn around 18 of these bronze
              coins a day.
            </ParaTextLeft>
          </div>
        </div>

        {/* SECTION 1.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-down">
              People needed these coins to buy things in Antioch’s markets.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={people} alt="Logo" data-aos="fade-in" className="img-responsive" />
            <Captions data-aos="fade-in">
              This painting is based upon the <em>Departure Mosaic</em>
              from the “House of Menander” (mid 3rd century CE), which was excavated at Daphne
              (Antioch’s suburb) and is now at the San Diego Museum of Art.
            </Captions>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <SubText data-aos="fade-left">
              “Antioch, a city known to all the world… so rich is it in imported and local goods.”
              <br></br>
              <br></br>- Ammianus Marcellinus, <em>Roman Antiquities</em> 14.8.8
            </SubText>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 1.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-down">
              But this coin wasn’t worth very much, as it was made out of cheap bronze and not
              valuable gold or silver.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={bronze_caption} alt="Logo" data-aos="fade-right" className="size-images" />
          </div>
          <div className="col-md-4 align-self-center" style={{ textAlign: 'center' }}>
            <img src={silver_caption} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={gold_caption} alt="Logo" data-aos="fade-left" className="size-images" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 1.5 */}

        <div className="row top-spacer-3">
          <div className="col-md-7 align-self-center" style={{ textAlign: 'center' }}>
            <div>
              <img
                src={silver}
                alt="Logo"
                id="comp-5-silver-coin"
                data-aos="fade-in"
                className="size-images-md"
              />
            </div>
            <br></br>
            <div>
              <img src={equal_to} alt="Logo" data-aos="fade-in" className="size-images-50" />
            </div>
            <br></br>
            <div>
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="100"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="200"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="300"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="400"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="500"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="600"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="700"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="800"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="900"
                className="size-images-30"
              />
              <img
                src={bronze}
                alt="Logo"
                data-aos="fade-right"
                data-aos-duration="1000"
                className="size-images-30"
              />
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaTextLeft data-aos="fade-left">
              In fact, some scholars think that it might have taken over 100 of these bronze coins
              to equal the value of only 1 silver tetradrachm!
            </ParaTextLeft>
          </div>
        </div>

        {/* SECTION 2.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-7 align-self-center">
            <Level1Text data-aos="fade-left">
              This coin could still buy important items for a person living in Antioch.
            </Level1Text>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <img src={bronze} alt="Logo" className="size-images-head" data-aos="fade-in" />
          </div>
        </div>

        {/* SECTION 2.2 */}

        <div className="row top-spacer-3" style={{ textAlign: 'center' }}>
          <div className="col-md-3 align-self-center">
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="750"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1000"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1250"
            />
          </div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-in">Four bronze coins could buy a loaf of bread.</ParaText>
          </div>
          <div className="col-md-3 align-self-center">
            <img src={bread} alt="Logo" data-aos="fade-left" className="img-responsive" />
          </div>
        </div>

        {/* SECTION 2.3 */}

        <div className="row top-spacer-3" style={{ textAlign: 'center' }}>
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              Between 2 and 10 bronze coins could buy 1 quart of wine. Today, that’s the same as 2
              school milk cartoons.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-5 align-self-center">
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="500"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="700"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="900"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1100"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1300"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1500"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1700"
            />
            <img
              src={bronze}
              alt="Logo"
              className="size-images-sm"
              data-aos="fade-right"
              data-aos-duration="1900"
            />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-2 align-self-center">
            <img
              src={jug}
              alt="Logo"
              data-aos="fade-left"
              data-aos-duration="800"
              className="img-responsive"
            />
          </div>
          <div className="col-md-2 align-self-center">
            <img
              src={milk}
              alt="Logo"
              data-aos="fade-left"
              data-aos-duration="1000"
              className="img-responsive"
            />
          </div>
          <div className="col-md-2 align-self-center">
            <img
              src={milk}
              alt="Logo"
              data-aos="fade-left"
              data-aos-duration="1200"
              className="img-responsive"
            />
          </div>
        </div>

        {/* SECTION 3.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-7 align-self-center">
            <Level1Text data-aos="fade-left">
              Most of the Antioch civic coins were spent locally.
            </Level1Text>
          </div>
          <div className="col-md-5"></div>
        </div>

        {/* SECTION 3.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-in">Not all coins stayed in Antioch though.</ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 3.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-in">
              Instead some of the coins moved even hundreds of miles away.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 3.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-3 align-self-center">
            <SubText data-aos="fade-right">
              Click on the map to explore all the places these little bronze civic coins have been
              found through excavation.
            </SubText>
          </div>
          <div className="col-md-9">
            <Tableau data-aos="fade-in" />
          </div>
        </div>

        {/* SECTION 3.5 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-in">
              We cannot be sure that the Antiochians’ civic coins were worth money at all of these
              places.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 3.6 */}

        <div className="row top-spacer-3">
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={citycoin1} alt="Logo" className="size-images" />
            </div>
            <SubText>This civic bronze was minted at Laodicea ad Mare, Antioch’s rival.</SubText>
          </div>
          <div className="col-md-6 align-self-center" data-aos="fade-in">
            <ParaText>
              Many other cities minted their own civic coins and may have refused to accept the
              Antiochians’ coins in the market.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={citycoin2} alt="Logo" className="size-images" />
            </div>
            <SubText>
              This civic bronze coin was minted at Seleucia Pieria, Antioch’s neighbor.
            </SubText>
          </div>
        </div>

        {/* SECTION 7.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 align-self-center">
            <ParaText data-aos="fade-down">
              Still, how far away the coins moved speaks to all the trade routes running in and out
              of Antioch and all the people coming and going from the city with little bronze coins
              in their pockets.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* Bottom Buttons */}

        <div className="row top-spacer-05">
          <div className="col-md-4 offset-2">
            <StyledLinkButton to="/maps" data-aos="fade-right">
              Where did the civic coins move?
            </StyledLinkButton>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <StyledLinkButton to="/select-story" data-aos="fade-left">
              Tell me another story!
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
                  href="https://gallica.bnf.fr/ark:/12148/btv1b8507493h.r=Hadrian%20Hadrian?rk=515024;0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies,
                  médailles et antiques, Fonds général 430
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://rpc.ashmus.ox.ac.uk/coin/73446"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Roman Provincial Coinage Project
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.39966"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society - 1944.100.39966
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://gallica.bnf.fr/ark:/12148/btv1b84967440"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies,
                  médailles et antiques, M 5464
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://gallica.bnf.fr/ark:/12148/btv1b8508048m"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies,
                  médailles et antiques, Louis de Clercq 280
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
                Butcher, K. 2002, “Circulation of Bronze Coinage in the Orontes Valley in the Late
                Hellenistic and Early Roman Periods,” in C. Augé and F. Duyrat (eds.), Les
                monnayages syriens: quel apport pour l'histoire du Proche-Orient hellénistique et
                romain?: actes de la table ronde de Damas, 10-12 novembre 1999. Beirut: Institut
                Français d''Archéologie du Proche- Orient. 145-152.
              </li>
              <br></br>
              <li>
                Harl, K.W. 1996. <em>Coinage in the Roman Economy</em>, 300 B.C. to A.D. 700.
                Baltimore: Johns Hopkins University Press.
              </li>
              <br></br>
              <li>
                Scheidel, W., Morris, I. and Saller, R. (eds.), 2007,{' '}
                <em>
                  The Cambridge Economic History of the Greco- Roman World. Cambridge University
                  Press
                </em>
                .
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

export default Economic;
