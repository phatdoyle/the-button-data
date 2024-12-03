// components/Button.js
import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
  width: 200px;
  height: 200px;
  border: 10px solid black;
  border-radius: 50%;
  background: linear-gradient(to bottom, #e0e0e0, #c0c0c0);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: black;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  &:active {
    box-shadow: none;
  }
`;

export default function Button() {
  return <StyledButton>PRESS</StyledButton>;
}