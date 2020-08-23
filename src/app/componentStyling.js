import styled from "styled-components";
import { Link } from "react-router-dom";

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

// Styles for page components
const PageTitle = styled.p`
  color: #17434A;
  font-size: 64px;
  line-height: 78px;
  font-family: 'CormorantGaramond-Bold';
  letter-spacing: 0.03em;
`;

const PageSubTitle = styled.p`
  color: #17434A;
  font-family: 'CormorantGaramond-Regular';
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.03em;
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

const ParaTextLeft = styled.p`
   font-family: CormorantGaramond-Regular;
   font-size: 24px;
   text-align: left;
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

const Resources = styled.div`
   font-family: CormorantGaramond-Regular;
   background-color: WhiteSmoke;
   color: #2d616a;
`;

export { StyledLink, PageTitle, PageSubTitle, Level1Text, ParaText, ParaTextLeft, SubText, Resources }