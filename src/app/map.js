import React from "react";
import { StyledLink, StoryTitle, StoryTitleSM, Level1Text, ParaText, ParaTextBlueBG, ParaTextLeft, SubText, Captions, StyledPageLinkCaptions, StyledPageLinkRsrc, Resources } from "./componentStyling";
import AOS from "aos";
import TableauReport from 'tableau-react';

const CoinsExcavations = props => (
  <TableauReport
    url="https://public.tableau.com/views/AntiochCoinswithinExcavationSites/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

const Coins = props => (
  <TableauReport
    url="https://public.tableau.com/views/HoardswithAntiochCoins/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

const Excavations = props => (
  <TableauReport
    url="https://public.tableau.com/views/AntiochExcavations/Sheet1?:display_count=y&:origin=viz_share_link"
  />
)

const Roman = () => {
  AOS.init({
    duration: 1000,
    offset: -25,
  });

  return (
    <div>
        <div className="container-fluid px-6">

        {/* Page Entry */}

          <div className="row top-buffer-2">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <StoryTitleSM data-aos="slide-right">
                  Let Me
              </StoryTitleSM>
              <StoryTitle data-aos="slide-left">
                  MAP
              </StoryTitle>
              <StoryTitleSM data-aos="slide-up">
                  Coins
              </StoryTitleSM>
            </div>
            <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      Examining the distribution of coins within the
                      archaeological record offers an important perspective into
                      ancient Syria. The evolving patterns over time of where
                      and in what quantities these different coins moved help
                      testify to the activities, policies, and relationships of
                      the different peoples issuing and using them.
                  </ParaTextLeft>
              </div>
              <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      One way of studying the data is as raw quantities, which
                      tells us about the presence and absence of specific coins
                      in a particular location. However, if we want to understand
                      the significance of these finds, it can help to examine
                      the percentages in which they appear compared to all the
                      other coins discovered on site. No hard and fast rules
                      exist as to the percentage proving a coin circulated as
                      currency, but we can still develop informed conclusions
                      through the context of site histories and larger patterns.
                      Additionally, it is important to pay attention to outliers
                      or abnormalities and what they may suggest about the
                      movement of people.
                  </ParaTextLeft>
              </div>
              <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.3 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      In the study of Antioch, we have a wealth of research opportunities:
                      <ul>
                        <li>Because the mint produced coins for several different governmental authorities – civic, provincial, and royal/imperial – we can test how a political guarantee affected a coin’s movement and circulation.</li>
                        <li>Because the mint produced coins of different metals – gold, silver, bronze – we can test how a coin’s inherent value affected its movement and circulation.</li>
                        <li>Because the mint produced coins for over 700 years – from 300 BCE past 450 CE – we can test out the difference time makes on a coin’s movement and circulation.</li>
                      </ul>
                  </ParaTextLeft>
              </div>
              <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.4 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      This map displays the origins of coins excavated at Antioch.
                      Notice how the majority of the coins were minted locally,
                      which may suggest a local preference or even regulation of
                      circulating currency. Still, coins traveled to Antioch
                      from as far away as Rome and Seleucia on the Tigris.
                  </ParaTextLeft>
              </div>
              <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.5 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center">
                  <ParaText data-aos="fade-left">
                      This map displays the origins of coins excavated at Antioch.
                      Notice how the majority of the coins were minted locally,
                      which may suggest a local preference or even regulation of
                      circulating currency. Still, coins traveled to Antioch
                      from as far away as Rome and Seleucia on the Tigris.
                  </ParaText>
              </div>
              <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-10 align-self-center">
                  <Excavations data-aos="fade-in"/>
                  <Captions>
                      This visualization is based upon 10,000+ coins dating between 330 BCE
                      and 450 CE and excavted at Antioch. The coin catalog was published by
                      D. Waagé in <em>Antioch-on-the-Orontes IV.2: Greek, Roman, Byzantine, and
                      Crusader Coins</em> (Princeton University Press, 1952).
                      <br></br>
                      <StyledPageLinkCaptions a href="https://syrios.uh.edu/download" target="_blank">Click here to
                      download this data.</StyledPageLinkCaptions>
                  </Captions>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 1.6 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center">
                  <ParaText data-aos="fade-left">
                      This map displays the distribution of coins minted at
                      Antioch and discovered as single finds within official
                      excavations. Explore how a coin’s attributes – like metal,
                      minting period, or issuing authority – or external factors
                      – like distance or political borders – can change how a
                      coin moved over space and time.
                  </ParaText>
              </div>
              <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-10 align-self-center">
                  <CoinsExcavations data-aos="fade-in"/>
                  <Captions>
                      This visualization is based upon c. 100,000 coin finds
                      published in 80 excavation reports. See Appendix 2 in
                      Neumann, K. forthcoming. <em>Antioch in Syria: A History
                      from Coins, 300 BCE-450 CE </em> (Cambridge University Press).
                  </Captions>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 1.7 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center">
                  <ParaText data-aos="fade-left">
                      This map displays the distribution of silver and gold coins
                      minted at Antioch and discovered within a <span id="term">hoard </span>
                      – a cache or collection of multiple coins in a single
                      location. Silver and gold coins can be rare finds on an
                      archaeological site, because people would look for them if
                      dropped. Hoards, however, are often created when a person
                      intentionally tries to hides valuable coins either as
                      savings or in times of emergency.
                  </ParaText>
              </div>
              <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-10 align-self-center">
                  <Coins data-aos="fade-in"/>
                  <Captions>
                      This visualization is based upon c. 215,000 coin finds
                      published in 300+ coin reports. See Appendix 3 in Neumann,
                      K. forthcoming. <em>Antioch in Syria: A History from Coins,
                      300 BCE-450 CE </em> (Cambridge University Press).
                  </Captions>
              </div>
              <div className="col-md-1"></div>
          </div>

          </div>

              {/* Resources */}

              <Resources>
                <div className="row top-spacer-2"></div>
                <div className="row top-spacer-1">
                      <div className="col-md-1">

                      </div>
                      <div className="col-md-5">
                          To learn more about coin distribution:
                          <br></br>
                          <br></br>
                          <ul>
                            <li>
                              Butcher, K. 2001-2002. “Small Change in Ancient Beirut: The Coin
                              Finds from BEY 006 and BEY 045: Persian, Hellenistic, Roman, and
                              Byzantine Periods,” <em>Berytus</em> 45-46.
                            </li>
                              <br></br>
                            <li>
                              Duyrat, F. 2016. <em>Wealth and Warfare: The Archaeology of Money
                              in Ancient Syria.</em> New York: The American Numismatic Society.
                            </li>
                              <br></br>
                            <li>
                              <a href="https://coinage.princeton.edu/" target="_blank" rel="noopener noreferrer">
                                FLAME: Framing the Late Antique and Early Medieval Economy.
                              </a>
                            </li>
                          </ul>
                      </div>
                      <div className="col-md-5">
                          <br></br>
                          <br></br>
                          <ul>
                            <li>
                              <a href="http://dlib.nyu.edu/awdl/isaw/isaw- papers/7/meadows-gruber/" target="_blank" rel="noopener noreferrer">
                                Meadows A. and Gruber, E. 2014. “Coinage and Numismatic Methods.
                                A Case Study of Linking a Discipline,” <em>ISAW Papers</em> 7.15.
                              </a>
                            </li>
                              <br></br>
                            <li>
                              Neumann, K. Forthcoming. <em>Antioch in Syria: A History from Coins,
                              300 BCE-450 CE</em> (Cambridge University Press).
                            </li>
                              <br></br>
                            <li>
                              <a href="https://chre.ashmus.ox.ac.uk/" target="_blank" rel="noopener noreferrer">
                                Oxford’s Coin Hoards of the Roman Empire.
                              </a>
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

export default Roman;
