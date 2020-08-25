import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

// Style for Button Links
const StyledLink = styled(Link)`
  cursor: pointer;
  color: white;
  font-size: calc(6px + 2vmin);;
  border-radius: 7px;
  padding: 10px 15px 10px 15px;
  background-color: #7EA274;
  border: none;
    text-decoration: none;
    font-family: CormorantGaramond;
    letter-spacing: 0.03em;

    &:focus, &:visited, &:link, &:active {
        text-decoration: none;
        color: white;
    }
    &:hover {
      background: #BE9672;
    }
`;

// Style for non-button Links
const StyledPageLink = styled(Link)`
  cursor: pointer;
  color: #17434A;
  font-size: 64px;
  line-height: 78px;
  font-family: 'CormorantGaramond-Bold';
  letter-spacing: 0.03em;
  border: none;
    text-decoration: none;
    font-family: CormorantGaramond;
    letter-spacing: 0.03em;

    &:focus, &:visited, &:link, &:active {
        text-decoration: none;

    }
    &:hover {
      background: #BE9672;
    }
`;

// Styles for page components
const PageTitle = styled.p`
  color: #17434A;
  font-size: 64px;
  line-height: 78px;
  font-family: 'CormorantGaramond-Bold';
  letter-spacing: 0.03em;
`;

const PageTitleCentered = styled(PageTitle)`
  text-align: center;
`;

const PageSubTitle = styled(PageTitle)`
  font-family: 'CormorantGaramond-Regular';
  font-size: 30px;
  line-height: 36px;
`;

const PageSectionTitle = styled(PageTitle)`
  color: #E3B287;
  font-size: 30px;
  text-align: center;
`;

const StoryTitle = styled.p`
  color: #2d616a;
  font-size: 64px;
  line-height: 45px;
  font-family: 'CormorantGaramond-Bold';
  letter-spacing: 0.03em;
  text-align: center;
`;

const StoryTitleSM = styled(StoryTitle)`
  font-size: 32px;
  color: black;
`;

const Level1Text = styled.p`
   font-family: CormorantGaramond-Bold;
   color: #2d616a;
   font-size: 48px;
   text-align: left;
`;

const ParaText = styled.p`
   font-family: CormorantGaramond-Regular;
   font-size: 24px;
   text-align: center;
`;

const ParaTextBlueBG = styled(ParaText)`
   background-color: #2d616a;
   color: white;
`;

const ParaTextLeft = styled(ParaText)`
   text-align: left;
`;

const ParaTextLeftSmaller = styled(ParaTextLeft)`
   font-size: 20px;
`;

const SubText = styled.p`
   font-family: CormorantGaramond-Regular;
   background-color: WhiteSmoke;
   color: #2d616a;
   border-radius: 10px;
   padding: 40px;
   font-size: 18px;
   text-align: center;
`;

const SubTextLeft = styled.div`
   font-family: CormorantGaramond-Regular;
   background-color: WhiteSmoke;
   padding: 40px;
   font-size: 18px;
   text-align: left;
   border-top-right-radius: 30px;
   border-bottom-right-radius: 30px;
`;

const Captions = styled.p`
   font-family: CormorantGaramond-Regular;
   color: #2d616a;
   padding: 10px 30px;
   font-size: 14px;
   text-align: center;
`;

const Resources = styled.div`
   font-family: CormorantGaramond-Regular;
   background-color: WhiteSmoke;
   color: #2d616a;
`;

const FormContainer = styled.div`
  label {
    color: #2d616a;
    font-size: 1.2em;
    font-weight: 400;
  }
  .error {
    border: 2px solid #FF6565;
  }
  .error-message {
    color: #FF6565;
    padding: .5em .2em;
    height: 1em;
    position: absolute;
    font-size: .8em;
  }
  .form-group {
    margin-bottom: 2.5em;
  }
`;

// styling for form
const FormStyles = styled(Form)`
    font-family: "CormorantGaramond-Regular";
    font-size: larger;
    letter-spacing: 0.03em;
    color: #17434A;
`;

// styling for form button
const FormButton = styled(Button)`
  cursor: pointer;
  color: white;
  font-size: calc(6px + 2vmin);;
  border-radius: 7px;
  padding: 10px 15px 10px 15px;
  background-color: #7EA274;
  border: none;

  &:hover, &:disabled {
      background: #BE9672;
    }

  &:focus, &:visited, &:link, &:active {
        text-decoration: none;
        background-color: #7EA274;
    }
`;

// styling for Footer
const FooterHead = styled.div`
   font-family: CormorantGaramond-Bold;
   color: white;
   font-size: 30px;
   padding: 50px 0px;
`;

const FooterLinks = styled.div`
   font-family: CormorantGaramond-Regular;
   color: white;
   font-size: 18px;
   padding: 50px 0px;
`;

export {
    StyledLink,
    StyledPageLink,
    PageTitle,
    PageTitleCentered,
    PageSubTitle,
    PageSectionTitle,
    StoryTitle,
    StoryTitleSM,
    Level1Text,
    ParaText,
    ParaTextBlueBG,
    ParaTextLeft,
    ParaTextLeftSmaller,
    SubText,
    SubTextLeft,
    Captions,
    Resources,
    FormContainer,
    FormStyles,
    FormButton,
    FooterHead,
    FooterLinks
}
