import React from "react";
import styled from "styled-components";

const MetadataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  position: absolute;
  bottom: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 0;
  font-family: "DepartureMono", monospace;
`;

const MetadataBox = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 1.2rem;
  text-align: center;
  border-left: ${(props) => (props.withBorder ? "1px solid #dcdcdc" : "none")};
  background: ${(props) => (props.dark ? "#3d3d3d" : "white")};
  color: ${(props) => (props.dark ? "white" : "black")};
  &:first-child {
    border-left: none;
    border-radius: 20px 0 0 20px;
  }
  &:last-child {
    border-radius: 0 20px 20px 0;
  }
`;

const Metadata = ({ price, presses, lastPress }) => {
  return (
    <MetadataWrapper>
      <MetadataBox>Price to Press: {price} ETH</MetadataBox>
      <MetadataBox withBorder>Presses: {presses}</MetadataBox>
      <MetadataBox dark withBorder>
        Built by: @doyle126
      </MetadataBox>
    </MetadataWrapper>
  );
};

export default React.memo(Metadata);