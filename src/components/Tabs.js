import React, { useState } from "react";
import styled from "styled-components";

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const TabHeaders = styled.div`
  display: flex;
  justify-content: center;
  background: #f4f4f4;
  padding: 10px;
  border-bottom: 2px solid #ddd;
`;

const TabButton = styled.button`
  background: ${(props) => (props.active ? "#8884d8" : "white")};
  color: ${(props) => (props.active ? "white" : "black")};
  border: 1px solid #ddd;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px 5px 0 0;

  &:hover {
    background: #ddd;
  }
`;

const TabContent = styled.div`
  width: 100%;
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
`;

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabsWrapper>
      <TabHeaders>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabHeaders>
      <TabContent>{tabs[activeTab].content}</TabContent>
    </TabsWrapper>
  );
};

export default Tabs;