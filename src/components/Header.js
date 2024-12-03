import React from "react";
import styled from "styled-components";
import logo from "../assets/images/press.svg";

const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
`;

const Logo = styled.img`
  height: auto;
  width: 300px; /* Default width */
  max-width: 350px; /* Maximum size for larger screens */
  cursor: pointer;

  @media (max-width: 768px) {
    width: 80px; /* Adjust width for smaller screens */
  }

  @media (max-width: 480px) {
    width: 60px; /* Adjust width for very small screens */
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      {/* Wrap the logo in an anchor tag */}
      <a
        href="https://www.thebutton.press/refer/0xd8C73bceF080f33E37ea5a415bb0778ECD72Ce3B"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Logo src={logo} alt="Logo" />
      </a>

      {/* <WalletInfo>Barf.eth</WalletInfo> */}
    </HeaderWrapper>
  );
};

export default React.memo(Header);