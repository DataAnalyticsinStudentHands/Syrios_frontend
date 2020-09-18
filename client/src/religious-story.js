import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  StyledLink,
  StyledLinkTerm,
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
import zeus_coin from './data/religious-images/zeus_coin.png';
import zeus_hl_coin from './data/religious-images/zeus_hl_coin.png';
import zeus_hl_coin2 from './data/religious-images/zeus_hl_coin2.png';
import eagle from './data/religious-images/eagle.png';
import temple_1 from './data/religious-images/temple_1.png';
import temple_2 from './data/religious-images/temple_2.png';
import zeus_coin2 from './data/religious-images/zeus_coin2.png';
import zeus_coin3 from './data/religious-images/zeus_coin3.png';
import zeus_coin4 from './data/religious-images/zeus_coin4.png';
import zeus_coin5 from './data/religious-images/zeus_coin5.png';
import zeus_coin6 from './data/religious-images/zeus_coin6.png';
import zeus_coin7 from './data/religious-images/zeus_coin7.png';
import zeus_coin8 from './data/religious-images/zeus_coin8.png';
import zeus_coin9 from './data/religious-images/zeus_coin9.png';
import zeus_coin10 from './data/religious-images/zeus_coin10.png';

const religiousStory = () => {
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
            <StoryTitle data-aos="slide-left">RELIGIOUS</StoryTitle>
            <StoryTitleSM data-aos="slide-up">Story</StoryTitleSM>
          </div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <StoryTitleSM data-aos="slide-right">
              a story about<span id="yellow"> ZEUS </span>
            </StoryTitleSM>
          </div>
        </div>

        {/* SECTION 1.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-4 align-self-center">
            <img src={zeus_coin} alt="Logo" className="size-images-head" data-aos="fade-in" />
          </div>
          <div className="col-md-8 align-self-center">
            <Level1Text data-aos="fade-left">This is the Greek god Zeus.</Level1Text>
          </div>
        </div>

        {/* SECTION 1.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_hl_coin} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <ParaText data-aos="fade-left">He was the king of the Greek gods...</ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-1">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-up">...and he was a god for the Hellenistic kings.</ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 2.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8 align-self-center">
            <Level1TextCenter data-aos="fade-left">
              The kings of the {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucid_coins_online"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Seleucid Empire
                </StyledLinkTerm>
              {' '} especially thought of Zeus as their special
              protector.
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 2.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              This is one of the reasons the kings featured Zeus on their royal coins.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-2"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_hl_coin2} alt="Logo" data-aos="fade-right" className="size-images" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center">
            <SubText data-aos="fade-left">
              In this coin, we see Zeus Nicephorus – he actually carries Victory in his hand as he
              sits on a throne. This type was used over and over again.
            </SubText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 2.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              According to legend, Zeus helped {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucus_i"
                target="_blank"
                rel="noopener noreferrer"
                >
                  King Seleucus I
                </StyledLinkTerm>
              {' '} decide where to build Antioch in 300
              BCE.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={eagle} alt="Logo" data-aos="fade-right" className="img-responsive" />
          </div>
          <div className="col-md-5 align-self-center">
            <SubText data-aos="fade-left">
              " {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucus_i"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Seleucus
                </StyledLinkTerm>
              {' '} offered sacrifice to the gods by burning a slain bull on an altar. And Zeus
              sent down his eagle, who grabbed one of the bull thighs and flew away. {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucus_i"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Seleucus
                </StyledLinkTerm>
              {' '} sent his son to follow the bird. Eventually, the eagle
              dropped the sacrificial meat. The king knew that Zeus wanted him
              to build the city in that place."
              <br />
              <br />- Libanius <em>Or.</em> 11.84 (adapted)
            </SubText>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 2.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-in">
              After establishing Antioch, the kings continued to celebrate Zeus.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8 align-self-center">
            <Level1TextCenter data-aos="fade-left">
              <StyledLinkTerm
              href="http://nomisma.org/id/antiochus_iv"
              target="_blank"
              rel="noopener noreferrer"
              >
                King Antiochus IV
              </StyledLinkTerm>
            {' '} especially revered Zeus.​
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              He contributed to the building of a temple to Zeus in Athens, Greece.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center">
            <SubText data-aos="fade-right">
              “Truly, {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/antiochus_iv"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Antiochus IV's
                </StyledLinkTerm>
              {' '} magnificence towards the gods is evidenced by the temple to
              [Zeus Olympius] at Athens, the only one in the whole world which begins to capture the
              greatness of the god."
              <br />
              <br />
              –Livy 41.20
            </SubText>
          </div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={temple_1} alt="Logo" data-aos="fade-left" className="img-responsive" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 3.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              He also promised to build another temple to Zeus – (a.k.a. Jupiter) – in Antioch.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center" style={{ textAlign: 'center' }}>
            <img src={temple_2} alt="Logo" data-aos="fade-right" className="img-responsive" />
          </div>
          <div className="col-md-5 align-self-center">
            <SubText data-aos="fade-left">
              “At Antioch he projected a magnificent temple to Jupiter Capitolinus, of which not
              only the ceiling was to be overlaid with gold, but the whole of the walls were to be
              covered with gold leaf.”​
              <br />
              <br />
              -Livy 41.20
            </SubText>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 3.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              We aren’t sure if he ever finished this temple – or even started it – but we DO know
              that he added new images of Zeus to the coins.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 3.5 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_coin2} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-6 align-self-center">
            <ParaTextLeft data-aos="fade-left">
              On the <span id="term">obverse</span> of this bronze coin is the head of Zeus.
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 3.6 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-6 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              On the <span id="term">reverse</span> of this coin, we see Zeus’ eagle. In its talons
              is a lightning bolt.
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_coin3} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 3.7 */}

        <div className="row top-spacer-3">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <ParaText data-aos="fade-down">
              The lightning bolt reflects Zeus’ control over the weather.​
            </ParaText>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <SubText data-aos="fade-in">
              The Homeric poems refer to Zeus as “the gatherer of clouds,” “god of thunder,” and
              “god of lightning.”
            </SubText>
          </div>
          <div className="col-md-4"></div>
        </div>

        {/* SECTION 3.8 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-6 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              In fact, many coins minted at Antioch feature a lightning bolt to refer to Zeus. This
              symbol is one of Zeus’
              <span id="term"> attributes</span>.
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_coin4} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 4.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <Level1TextCenter data-aos="fade-left">
              But Zeus was not only a god for the kings. He was a god for the people too.​
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 4.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-4 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_coin5} alt="Logo" data-aos="fade-in" className="size-images" />
            <SubText data-aos="fade-in">
              A much later silver {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/tridrachm"
                target="_blank"
                rel="noopener noreferrer"
                >
                  tridrachm
                </StyledLinkTerm>
              {' '} possibly minted at Rome for Syria (c. 98 CE) features
              such a Zeus combined with a local god.
            </SubText>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-5 align-self-center">
            <ParaTextLeft data-aos="fade-left">
              The people of wider Syria sometimes identified Zeus with their regional gods, like
              Baalshamin (‘Lord of Heaven’) or Hadad (a bringer of storms).
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 4.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-in">
              This is called <span id="term">syncretism</span>, where belief systems are blended
              together.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 5.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <Level1TextCenter data-aos="fade-left">
              The people of Antioch also worshipped Zeus. Our best evidence comes from their civic
              coins.
            </Level1TextCenter>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* SECTION 5.2 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              The very first coins minted by the citizens under {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucus_i"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Seleucus I
                </StyledLinkTerm>
              {' '} feature Zeus and a
              lightning bolt, plus the name of the Antiochians.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <img src={zeus_coin6} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-3">
            <img src={zeus_coin7} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 5.3 */}

        <div className="row top-spacer-3">
          <div className="col-md-1"></div>
          <div className="col-md-6 align-self-center">
            <ParaTextLeft data-aos="fade-right">
              Later on, when {' '}
                <StyledLinkTerm
                href="http://nomisma.org/id/seleucus_i"
                target="_blank"
                rel="noopener noreferrer"
                >
                  Antiochus IV
                </StyledLinkTerm>
              {' '} ruled, the Antiochians featured a standing Zeus alongside
              their name.
            </ParaTextLeft>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-3 align-self-center" style={{ textAlign: 'center' }}>
            <img src={zeus_coin8} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-1"></div>
        </div>

        {/* SECTION 5.4 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              The citizens continued using Zeus on their coins, even after the Seleucid kings fell
              and the Romans conquered Syria.
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>
        <div className="row top-spacer-05">
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <img src={zeus_coin9} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-3">
            <img src={zeus_coin10} alt="Logo" data-aos="fade-in" className="size-images" />
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* SECTION 6.1 */}

        <div className="row top-spacer-3">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <ParaText data-aos="fade-down">
              There are economic reasons for continuing the same coin types as the Seleucid kings,
              but this also reflects the importance of Zeus to the citizens themselves. ​
            </ParaText>
          </div>
          <div className="col-md-2"></div>
        </div>

        {/* Bottom Buttons */}

        <div className="row top-spacer-05">
          <div className="col-md-4 offset-2">
            <StyledLinkButton to="/coins" data-aos="fade-right">
              Explore other gods
            </StyledLinkButton>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-4">
            <StyledLinkButton to="/select-story" data-aos="fade-left">
              Tell me another story.
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
            <br />
            <br />
            <ul>
              <li>
                <StyledLink
                  href="https://gallica.bnf.fr/ark:/12148/btv1b85678605"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bibliothèque nationale de France, département Monnaies, médailles et antiques, C
                  2089
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1948.19.2338"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1948.19.2338
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1953.171.1677"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1953.171.1677
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1948.19.1983"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1948.19.1983
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1944.100.75011"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society 1944.100.75011{' '}
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="http://numismatics.org/collection/1967.152.609?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  American Numismatic Society - 1967.152.609{' '}
                </StyledLink>
              </li>
            </ul>
          </div>
          <div className="col-md-5 ">
            To read more, check these out:
            <br />
            <br />
            <ul>
              <li>
                <StyledLink
                  href="https://journals.openedition.org/syria/344?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Butcher, K. 2007. “Two Syrian Deities.” <em>Syria</em> 84: 277-285.
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="https://www.jstor.org/stable/284220"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rigsby, K.J. 1980. “Seleucid Notes.”{' '}
                  <em>Transactions of the American Philological Association</em> 110: 233-254.
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="https://www.jstor.org/stable/24668172"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wright, N. 2005. “Seleucid Royal Cult, Indigenous Religious Traditions, and Radiate
                  Crowns: The Numismatic Evidence.” <em>Mediterranean Archaeology</em> 18: 67-82.
                </StyledLink>
              </li>
              <br />
              <li>
                <StyledLink
                  href="https://www.jstor.org/stable/24651941"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wright, N. 2009/10. “Non-Greek Religious Imagery on the Coinage of Seleucid Syria.”{' '}
                  <em>Mediterranean Archaeology</em> 22/23: 193-206.
                </StyledLink>
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

export default religiousStory;
