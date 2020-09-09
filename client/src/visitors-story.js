import React from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'tableau-api';
import TableauReport from 'tableau-react';
import {
  StyledLink,
  StyledLinkButton,
  StoryTitle,
  StoryTitleSM,
  Level1Text,
  Level1TextCenter,
  ParaText,
  ParaTextLeft,
  SubText,
  Resources,
} from './componentStyling';
import antioch from './data/visitors-images/antioch.png';
import newyork from './data/visitors-images/newyork.png';
import handcoin from './data/visitors-images/handcoin.png';
import coin1 from './data/visitors-images/coin1.png';
import bronzechart from './data/visitors-images/bronzechart.png';
import nabataea1 from './data/visitors-images/nabataea1.png';
import nabataea2 from './data/visitors-images/nabataea2.png';
import petra from './data/visitors-images/petra.png';
import petra2 from './data/visitors-images/petra2.png';
import silverdenarii1 from './data/visitors-images/silverdenarii1.png';
import silverdenarii2 from './data/visitors-images/silverdenarii2.png';
import romanbronze1 from './data/visitors-images/romanbronze1.png';
import romanbronze2 from './data/visitors-images/romanbronze2.png';
import syriacoin1 from './data/visitors-images/syriacoin1.png';
import syriacoin2 from './data/visitors-images/syriacoin2.png';
import coinchart from './data/visitors-images/coinchart.png';
import coinchart1 from './data/visitors-images/coinchart1.png';
import coinchart2 from './data/visitors-images/coinchart2.png';
import soldiers from './data/visitors-images/soldiers.png';

const Tableau1 = props => (
  <TableauReport
    url="https://public.tableau.com/views/ForeignFindsatAntiochRomanPeriod/Sheet1?:language=en&:display_count=y&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
);

const Tableau2 = props => (
  <TableauReport
    url="https://public.tableau.com/views/ForeignCoinsmintedduringtheRomanperiodandfoundatDuraEuropos/Sheet1?:language=en&:display_count=y&publish=yes&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
);

const Tableau3 = props => (
  <TableauReport
    url="https://public.tableau.com/shared/MDMS6GNNF?:display_count=y&:origin=viz_share_link"
    // token="<TRUSTED TICKET HERE>"
  />
);

const Visitors = () => {
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
            <StoryTitleSM data-aos="slide-right">The</StoryTitleSM>
            <StoryTitle data-aos="slide-left">VISITOR'S</StoryTitle>
            <StoryTitleSM data-aos="slide-up">Story</StoryTitleSM>
          </div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <StoryTitleSM data-aos="slide-right">
              the<span id="yellow"> ROMAN </span>period
            </StoryTitleSM>
          </div>
        </div>

        {/* SECTION 1.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-12">
            <img src={antioch} alt="Logo" className="bg-img2" data-aos="fade-in" />
          </div>
          <div className="col-md-8 align-self-center">
            <Level1Text data-aos="fade-left">In 115 CE, an earthquake struck Antioch.</Level1Text>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 1.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-4 align-self-center">
            <ParaText data-aos="fade-right">
              According to the ancient historian Cassius Dio, the disaster hurt visitors from all
              over the Mediterranean and the Middle East.
            </ParaText>
          </div>
          <div className="col-md-8">
            <SubText data-aos="fade-up">
              “And while [the emperor Trajan] was spending time in Antioch, an extraordinary
              earthquake occurred: even though many cities suffered, Antioch was by far the most
              unfortunate. For because Trajan was passing the winter in the city, and many soldiers
              and private individuals from all corners had gathered there for legal matters,
              embassies, commerce, and spectacle, not a single people group or land went unharmed –
              and thus in Antioch, the whole world under Roman control was shaken.”
              <br></br>
              <br></br>- Cassius Dio 68.24.1-2
            </SubText>
          </div>
        </div>

        {/* SECTION 1.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              The damage was like a disaster hitting New York or London during a world summit.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-2"></div>
          <div className="col-md-8" style={{ textAlign: 'center' }}>
            <img src={newyork} alt="Logo" data-aos="fade-up" className="img-responsive" />
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 1.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">But who were these people?</ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 2.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-8 align-self-center">
            <Level1Text data-aos="fade-left">
              The coins excavated at Antioch can give us a sense of who visited the city during the
              Roman period.
            </Level1Text>
          </div>
          <div className="col-md-4">
            <img src={handcoin} alt="Logo" className="bg-img2" data-aos="fade-in" />
          </div>
        </div>

        {/* SECTION 2.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={coin1} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              At Antioch, 960 total identifiable coins were excavated that date to the Roman period.
            </ParaTextLeft>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 2.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">949 are bronze and 11 are silver.</ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 2.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={bronzechart} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              Of the bronze coins, over 80% were minted within Antioch.
            </ParaTextLeft>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8 align-self-center">
            <Level1TextCenter data-aos="fade-left">
              The rest of the coins come from a scattered mix across the Levant and Mediterranean.​
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Tableau1 data-aos="fade-in" />
          </div>
          <div className="col-md-1"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-up">
              Although we cannot be sure that people from these locations were the ones who carried
              the coins into Antioch, their spread still gives us a hint as to who might have been
              affected by the earthquake.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 3.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              Still, this isn’t quite the diversity we see at other Syrian sites, such as at Dura
              Europos (a border city under Parthian rule for much of the Roman period).
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Tableau2 data-aos="fade-in" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 3.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              This may be due to currency regulation at Antioch. In other words, officials within
              the city may have regulated what counted as currency within city limits.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 4.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8 align-self-center">
            <Level1TextCenter data-aos="fade-left">
              Even so, the coin assemblage contains important stories about the people at Antioch.
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 4.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3" data-aos="flip-right">
            <div style={{ textAlign: 'center' }}>
              <img src={nabataea1} alt="Logo" className="size-images" />
            </div>
            <SubText>The obverse shows King Rabbel and his wife, Queen Gamilath.</SubText>
          </div>
          <div className="col-md-4 align-self-center" data-aos="fade-in">
            <ParaText>
              For example, 20 coins from the Kingdom of Nabataea were excavated within Antioch.
            </ParaText>
          </div>
          <div className="col-md-3" data-aos="flip-left">
            <div style={{ textAlign: 'center' }}>
              <img src={nabataea2} alt="Logo" className="size-images" />
            </div>
            <SubText>The reverse shows two cornucopiae and a legend in the local language.</SubText>
            <div className="col-md-1"></div>
          </div>
        </div>

        {/* SECTION 4.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              The Nabataeans are famous for their city of Petra…
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={petra} alt="Logo" data-aos="fade-in" className="img-responsive" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 4.4 */}

        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={petra2} alt="Logo" data-aos="fade-in" className="img-responsive" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              …and for great wealth due to their trade in luxury goods across ancient Arabia.
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 4.5 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              Their coins show up even further than their kingdom, testifying to the vast trade
              network and the many interactions along it.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Tableau3 data-aos="fade-in" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 4.6 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              And the people moving in and out of Antioch were a part of this trade network.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 5.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8 align-self-center">
            <Level1TextCenter data-aos="fade-left">
              Perhaps the most important story lies in the 102 Roman coins found in the city.
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 5.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">This total includes…</ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-4" style={{ textAlign: 'center' }}>
            <img src={silverdenarii1} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <img src={silverdenarii2} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <SubText>10 silver denarii</SubText>
          </div>
          <div className="col-md-4" style={{ textAlign: 'center' }}>
            <img src={romanbronze1} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <img src={romanbronze2} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <SubText>57 imperial Roman bronzes</SubText>
          </div>
          <div className="col-md-4" style={{ textAlign: 'center' }}>
            <img src={syriacoin1} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <img src={syriacoin2} alt="Logo" data-aos="fade-in" className="size-images-md" />
            <SubText>35 coins minted in Rome specifically for Syria</SubText>
          </div>
        </div>

        {/* SECTION 5.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              The coins range in date, but notice how the quantities increase over time.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-2 align-self-center" style={{ textAlign: 'center' }}>
            <img src={coinchart1} alt="Logo" className="size-images-md" data-aos="flip-right" />
          </div>
          <div className="col-md-8 align-self-center" style={{ textAlign: 'center' }}>
            <img src={coinchart} alt="Logo" className="img-responsive" data-aos="flip-right" />
          </div>
          <div className="col-md-2 align-self-center" style={{ textAlign: 'center' }}>
            <img src={coinchart2} alt="Logo" className="size-images-md" data-aos="flip-right" />
          </div>
        </div>

        {/* SECTION 6.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-12">
            <img src={soldiers} alt="Logo" className="bg-img2" data-aos="fade-in" />
          </div>
          <div className="col-md-8 align-self-center">
            <Level1Text data-aos="fade-left">
              This makes sense! Like the passage from Cassius Dio showed, Antioch became the focus
              of Roman investment as a political and military center during the second century CE.
            </Level1Text>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 6.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-in">
              As more Roman officials and soldiers gathered within Antioch, more Roman coins
              traveled along with them into the city.
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 6.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-in">
              These coins therefore testify to the merging worlds of Antioch and the Roman empire.
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
                  href="https://gallica.bnf.fr/ark:/12148/btv1b8479972c?rk=1051507;2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source gallica.bnf.fr / Bibliothèque nationale de France, département Monnaies,
                  médailles et antiques, Vogüé 227
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/2017.32.62"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 2017.32.62
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1935.117.369"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1935.117.369
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1995.11.491"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1995.11.491
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="https://gallica.bnf.fr/ark:/12148/btv1b8507176z.r=%22M%205158%22?rk=21459;2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bibliothèque nationale de France, Département Monnaies, médailles et antiques, M
                  5158
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.38396"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1944.100.38396
                </StyledLink>
              </li>
              <br></br>
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1956.127.1143"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1956.127.1143
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
                Butcher, K. 2002. “Circulation of Bronze Coinage in the Orontes Valley in the Late
                Hellenistic and Early Roman Periods,” in C. Augé and F. Duyrat (eds.),{' '}
                <em>
                  Les monnayages syriens: quel apport pour l'histoire du Proche-Orient hellénistique
                  et romain?: actes de la table ronde de Damas, 10-12 novembre 1999
                </em>
                . Beirut: Institut Français d''Archéologie du Proche-Orient. 145-152.
              </li>
              <br></br>
              <li>
                Butcher, K. 2004. <em>Coinage in Roman Syria: Northern Syria, 64 BC-AD 253</em>.
                London: Royal Numismatic Society.
              </li>
              <br></br>
              <li>
                Huth, M. and van Alfen, P. G. 2010.{' '}
                <em>Coinage of the Caravan Kingdoms: Studies in Ancient Arabian Monetization</em>.
                New York: American Numismatic Society.
              </li>
              <br></br>
              <li>
                Millar, F. 1993. <em>The Roman Near East, 31 BC-AD 337</em>. Cambridge, MA: Harvard
                University Press
              </li>
              <br></br>
              <li>
                Young, G.K. 2001.{' '}
                <em>
                  Rome’s Eastern Trade: International Commerce and Imperial Policy, 31 BC – AD 305
                </em>
                . London: Routledge.
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

export default Visitors;
