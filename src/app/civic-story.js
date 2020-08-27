import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { StyledLink, StoryTitle, StoryTitleSM, Level1Text, ParaText, ParaTextBlueBG, ParaTextLeft, SubText, Captions, Resources } from "./componentStyling";
import comp_1 from "./data/civic-images/comp-1.png";
import comp_5_left from "./data/civic-images/comp-5-left.png";
import comp_5_right from "./data/civic-images/comp-5-right.png";
import comp_7_1 from "./data/civic-images/comp-7-1.png";
import comp_7_2 from "./data/civic-images/comp-7-2.png";
import comp_7_3 from "./data/civic-images/comp-7-3.png";
import comp_7_4 from "./data/civic-images/comp-7-4.png";
import comp_7_5 from "./data/civic-images/comp-7-5.png";
import citizens from "./data/civic-images/citizens.png";
import boule from "./data/civic-images/boule.png";
import boule_edit from "./data/civic-images/boule_edit.png";
import theatre from "./data/civic-images/theatre.png";
import forum from "./data/civic-images/forum.png";
import vote from "./data/civic-images/vote.png";
import festival from "./data/civic-images/festival.png";
import zeus from "./data/civic-images/zeus.png";
import protest from "./data/civic-images/protest.png";
import protest_2 from "./data/civic-images/protest-2.png";
import inscription from "./data/civic-images/inscription.png";
import council from "./data/civic-images/council.png";
import city from "./data/civic-images/city.png";

const civicStory = () => {
  AOS.init({
    duration: 1000,
  });

  return (
    <div>
        <div className="container-fluid px-6">

        {/* Page Entry */}

          <div className="row top-buffer-2">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <StoryTitleSM data-aos="slide-right">
                  The
              </StoryTitleSM>
              <StoryTitle data-aos="slide-left">
                  CIVIC
              </StoryTitle>
              <StoryTitleSM data-aos="slide-up">
                  Story
              </StoryTitleSM>
            </div>
            <div className="col-md-4"></div>
          </div>

          {/* SECTION 1.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-7">
                  <Level1Text data-aos="fade-right">
                    This is a <strong>bronze coin</strong> minted by the civic
                    government of Antioch for use by the citizens of Antioch.
                  </Level1Text>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <img
                    src={comp_1}
                    alt="Logo"
                    className="size-images-head"
                    data-aos="fade-in"
                  />
              </div>
          </div>

          {/* SECTION 1.2 */}

          <div className="row top-spacer-3">
            <div className="col-md-2"></div>
            <div className="col-md-8 align-self-center">
                <ParaText data-aos="fade-down">
                  Antioch was one of the most important cities of the Roman empire.
                  According to the ancient writers Strabo and Josephus, Antioch was
                  the third largest city.
                </ParaText>
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-right">
                    “Antioch – the metropolis of Syria, and, without dispute,
                    deserves the place of the third city in the habitable earth
                    that was under the Roman Empire.”
                    <br></br>
                    <br></br>
                    - Josephus, <em>Wars of the Jews</em> 3.29
                  </SubText>
              </div>
              <div className="col-md-4"></div>
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-left">
                    “Antioch is the metropolis of Syria…and it is does not fall much
                    short, either in power or in size, of Seleucia on the Tigris or
                    Alexandria in Egypt.”
                    <br></br>
                    <br></br>
                    - Strabo, <em>Geography</em> 16.2
                  </SubText>
              </div>
              <img
                src={city}
                alt="Logo"
                className="bg-img"
                data-aos="fade-up"
              />
          </div>

          {/* SECTION 1.3 */}

          <div className="row top-spacer-6">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-in">
                    Antioch compared to Rome was like Chicago is to New York City!
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 1.4 */}

          <div className="row top-spacer-3">
              <div className="col-md-1"></div>
              <div className="col-md-10 align-self-center">
                  <ParaTextBlueBG data-aos="slide-up">
                    But, as big as Antioch grew, it was still a city of citizens.
                    <br></br>
                    And the coins are an important reminder of this.
                  </ParaTextBlueBG>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1"></div>
              <div className="col-md-10">
                  <img
                      src={citizens}
                      alt="Logo"
                      className="size-images-920"
                  />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <Captions data-aos="fade-left">
                      This painting is based upon the <em>Mosaic of a Funerary Symposium </em>
                      (late 4th century CE), which was excavated at Antioch and is now at the
                      Worcester Art Museum (Object Number: 1936.26)
                  </Captions>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 2.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-7">
                  <Level1Text data-aos="fade-right">
                      On the front of the coins, the citizens wrote their name:
                      ΑΝΤΙΟΧΕΩΝ, which means “Belongs to the Antiochians.”
                  </Level1Text>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <img
                    src={comp_5_left}
                    alt="Logo"
                    className="size-images-head"
                    data-aos="fade-in"
                  />
              </div>
          </div>

          {/* SECTION 2.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-in">
                      This name was important because it made clear the governmental
                      authority who paid for the coins, minted the coins, and
                      gave the cheap bronze value as money. 
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 2.3 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-in">
                      It was the citizens of Antioch, and not any Roman emperor.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 3.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-7">
                  <Level1Text data-aos="fade-right">
                      The government also added another message in Greek (just
                      barely visible on this worn coin): ΜΗΤΡΟΠΟΛΕΩΣ.
                  </Level1Text>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <img
                    src={comp_5_right}
                    alt="Logo"
                    className="size-images-head"
                    data-aos="fade-in"
                  />
              </div>
          </div>

          {/* SECTION 3.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-1"></div>
              <div className="col-md-10 align-self-center">
                  <ParaText data-aos="fade-in">
                      This means <span id="term">metropolis</span>.
                  </ParaText>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 3.3 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-in">
                      This was a special civic status, which emphasized the size,
                      culture, and history of the city.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 3.4 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      The Antiochians were so proud of this special title, they
                      included it on their coins for over 300 years!
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-2 align-self-center">
                  <img
                    src={comp_7_1}
                    alt="Logo"
                    data-aos="fade-right"
                    data-aos-duration="600"
                    className="size-images-md"
                  />
              </div>
              <div className="col-md-2 align-self-center">
                  <img
                    src={comp_7_2}
                    alt="Logo"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                    className="size-images-md"
                  />
              </div>
              <div className="col-md-2 align-self-center">
                  <img
                    src={comp_7_3}
                    alt="Logo"
                    data-aos="fade-right"
                    data-aos-duration="1400"
                    className="size-images-md"
                  />
              </div>
              <div className="col-md-2 align-self-center">
                  <img
                    src={comp_7_4}
                    alt="Logo"
                    data-aos="fade-right"
                    data-aos-duration="1800"
                    className="size-images-md"
                  />
              </div>
              <div className="col-md-2 align-self-center">
                  <img
                    src={comp_7_5}
                    alt="Logo"
                    data-aos="fade-right"
                    data-aos-duration="2200"
                    className="size-images-md"
                  />
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 4.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-7">
                  <Level1Text data-aos="fade-right">
                      The images on the coins celebrate the local government.
                      Here we see a personification of the city’s
                      <span id="term"> boule</span> – or council.
                  </Level1Text>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <img
                    src={boule_edit}
                    alt="Logo"
                    className="size-images-head"
                    data-aos="fade-in"
                  />
              </div>
          </div>

          {/* SECTION 4.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      The <span id="term">boule</span> was like our own local
                      government and civic councils.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={council}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-600"
                  />
              </div>
              <div className="col-md-2"></div>
          </div>

          {/* SECTION 4.3 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      The boule was like our own local government and civic
                      councils. <span id="term"> demos</span> – the citizen body
                      – together to debate publicly in the city’s theatre.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-8 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={theatre}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-600"
                  />
              </div>
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-left">
                      "Then the emperor’s lieutenant entered the theatre at
                      Antioch, where the people regularly hold their public
                      assemblies, and addressed the crowd which hurried there."
                      <br></br>
                      <br></br>
                      - Tacitus, <em>Histories</em> 2.80
                  </SubText>
              </div>
          </div>

          {/* SECTION 4.4 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      This is just like the debates and public forums that happen
                      in our own local governments!
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={forum}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-600"
                  />
              </div>
              <div className="col-md-2"></div>
          </div>

          {/* SECTION 4.5 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-3">
                  <img
                      src={boule}
                      alt="Logo"
                      data-aos="fade-in"
                      className="size-images"
                  />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      Voting was an important job of the boule and demos. The
                      coin even shows this! Notice how the boule votes by
                      dropping a pebble into a bucket!
                  </ParaTextLeft>
              </div>
              <div className="col-md-2"></div>
          </div>

          {/* SECTION 4.6 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-4 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      Just like today, the citizens had a say in the operations of their
                      city government!
                  </ParaTextLeft>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-3">
                  <img
                      src={vote}
                      alt="Logo"
                      data-aos="fade-right"
                      className="size-images"
                  />
              </div>
              <div className="col-md-2"></div>
          </div>


          {/* SECTION 4.7 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      The boule and magistrates also hosted many civic celebrations for
                      their community.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-5 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={festival}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-400"
                  />
                  <Captions data-aos="fade-up">
                      This painting is based upon the <em>Mosaic of Bacchic
                      Dancers</em> (2nd cent. CE), which was excavated at Antioch
                      and is now at the Hatay Archaeology Museum (Antakya, Hatay
                      Province, Turkey).
                  </Captions>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-left">
                      “The citizens of Antioch, a large and prosperous city, celebrate
                      festivals virtually every day of the year in the city and in the
                      surrounding area.”
                      <br></br>
                      <br></br>
                      - Herodian, <em>History of the Roman Empire</em> 2.7.9
                  </SubText>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 4.8 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-3">
                  <img
                      src={zeus}
                      alt="Logo"
                      data-aos="fade-in"
                      className="size-images"
                  />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <ParaTextLeft data-aos="fade-left">
                      Many of these civic festivals celebrated the gods. This
                      includes Zeus, who is featured on the front of this coin!
                  </ParaTextLeft>
              </div>
              <div className="col-md-2"></div>
          </div>

          {/* SECTION 5.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <Level1Text data-aos="fade-left">
                      Finally, the boule could lead the people in protest if they didn’t
                      agree with the Roman emperor.
                  </Level1Text>
              </div>
              <div className="col-md-4"></div>
          </div>


          {/* SECTION 5.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-2"></div>
              <div className="col-md-8 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={protest}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-600"
                  />
              </div>
              <div className="col-md-2"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-up">
                      Today, peaceful demonstrations remain an important right
                      of our citizens.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 5.3 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      Sometimes, though, the Antiochians could lose the power of
                      their local government.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-5 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={protest_2}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-400"
                  />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-left">
                      “The emperor Marcus Aurelius pardoned…the Antiochians, who
                      had said many things against Marcus in favor of Cassius, a
                      rival to the throne. The emperor had previously taken away
                      their shows and public assemblies and every type of meeting,
                      and had issued the harshest edict against them.”
                      <br></br>
                      <br></br>
                      - Scriptores Historiae Augustae, <em>Marcus Aurelius</em> 25.8-12
                  </SubText>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 5.4 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-in">
                      This is a major difference between then and now! Even though
                      the local government was democratic, the Antiochians lived
                      under the absolute rule of the emperor.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* SECTION 6.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-8 align-self-center">
                  <Level1Text data-aos="fade-left">
                      Unfortunately, detailed records for the boule have not survived, so we
                      don’t know a lot about the individual officials.
                  </Level1Text>
              </div>
              <div className="col-md-4"></div>
          </div>

          {/* SECTION 6.2 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      An inscription from Palmyra does mention the name of one
                      city magistrate.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>
          <div className="row top-spacer-05">
              <div className="col-md-1"></div>
              <div className="col-md-5 align-self-center" style={{textAlign: 'center'}}>
                  <img
                    src={inscription}
                    alt="Logo"
                    data-aos="fade-in"
                    className="size-images-400"
                  />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4 align-self-center">
                  <SubText data-aos="fade-left">
                      "Marcus Aemilius Marcianus Asclepiades, the bouleutes of
                      the Antiochians."
                      <br></br><br></br>
                      This man also worked as a tax-collector for the Romans.
                      <br></br><br></br>
                      Notice how this inscription is written in both Greek (top)
                      and Palmyrene, a local Syrian language (bottom).
                  </SubText>
              </div>
              <div className="col-md-1"></div>
          </div>

          {/* SECTION 7.1 */}

          <div className="row top-spacer-3">
              <div className="col-md-3"></div>
              <div className="col-md-6 align-self-center">
                  <ParaText data-aos="fade-down">
                      Because so few records have survived, our ancient coin is
                      a very important reminder of the local government who minted
                      it and the local citizens who used it.
                  </ParaText>
              </div>
              <div className="col-md-3"></div>
          </div>

          {/* Bottom Buttons */}

          <div className="row top-spacer-05">
              <div className="col-md-4 offset-2">
                  <StyledLink to="/tableau-maps" data-aos="fade-right">
                    Where did the civic coins move?
                  </StyledLink>
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-4">
                <StyledLink to="/select-story" data-aos="fade-left">
                  Tell me another story!
                </StyledLink>
              </div>
          </div>
      </div>

          {/* Resources */}

          <Resources>
            <div className="row top-spacer-2"></div>
            <div className="row top-spacer-1">
                  <div className="col-md-1">

                  </div>
                  <div className="col-md-5">
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
                  </div>
                  <div className="col-md-5 ">
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
                  </div>
                <div className="col-md-1"></div>
              </div>
            <div className="row top-spacer-1"></div>
          </Resources>

    </div>
  );
};

export default civicStory;
