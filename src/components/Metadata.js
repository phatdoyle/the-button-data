import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import ghostLogo from "../assets/images/Powered_by_Ghost_dark.png";
import DepartureMonoFont from "../assets/fonts/DepartureMono-Regular.woff2";

const MetadataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  position: absolute;
  bottom: 70px;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 0;
  font-family: 'DepartureMono', monospace;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    bottom: 90px;
  }
`;

const MetadataBox = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 1.2rem;
  text-align: center;
  border-left: ${(props) => (props.withBorder ? "1px solid #dcdcdc" : "none")};
  background: ${(props) => (props.dark ? "#3d3d3d" : "white")};
  color: ${(props) => (props.dark ? "white" : "black")};
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
    font-size: 1rem;
    border-left: none;
    border-top: ${(props) => (props.withBorder ? "1px solid #dcdcdc" : "none")};
    
    &:first-child {
      border-radius: 20px 20px 0 0;
    }
    &:last-child {
      border-radius: 0 0 20px 20px;
    }
  }

  &:first-child {
    border-left: none;
    border-radius: 20px 0 0 20px;
  }
  &:last-child {
    border-radius: 0 20px 20px 0;
  }
`;

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GlobalFontStyle = createGlobalStyle`
  @font-face {
    font-family: 'DepartureMono';
    src: url(${DepartureMonoFont}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  ${MetadataWrapper}, ${MetadataBox}, ${StyledLink} {
    font-family: 'DepartureMono', monospace !important;
  }
`;

const PoweredByWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 10;
  background-color: #aaaaaa;
  padding: 5px 10px;
  border-radius: 4px;

  @media (max-width: 768px) {
    bottom: 20px;
  }
`;

const GhostLogo = styled.img`
  height: 30px;
  width: auto;
  opacity: 0.8;
`;

const Metadata = ({ price, presses, lastPress }) => {
  return (
    <>
      <GlobalFontStyle />
      <MetadataWrapper>
        <MetadataBox>
          Winner: <StyledLink 
            href="https://basescan.org/address/0xA8040E167df161071E896f647C8E8C76bB8d4FFf"
            target="_blank"
            rel="noopener noreferrer"
          >
            0xA80...4FFf
          </StyledLink>
        </MetadataBox>
        <MetadataBox withBorder>Total Presses: {presses}</MetadataBox>
        <MetadataBox dark withBorder>
          Built by:<StyledLink 
            href="https://twitter.com/doyle126"
            target="_blank"
            rel="noopener noreferrer"
          >
            @doyle126
          </StyledLink>
        </MetadataBox>
      </MetadataWrapper>
      <PoweredByWrapper>
        <StyledLink 
          href="https://tryghost.xyz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GhostLogo src={ghostLogo} alt="Powered by Ghost" />
        </StyledLink>
      </PoweredByWrapper>
    </>
  );
};

export default React.memo(Metadata);