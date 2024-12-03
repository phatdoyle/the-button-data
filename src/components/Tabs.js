import React, { useState } from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  margin: 0 5px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const TabContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabContainer>
      <TabButtons>
        {React.Children.map(children, (child, index) => (
          <TabButton
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </TabButton>
        ))}
      </TabButtons>
      <TabContent>
        {React.Children.toArray(children)[activeTab]}
      </TabContent>
    </TabContainer>
  );
};

export default Tabs;