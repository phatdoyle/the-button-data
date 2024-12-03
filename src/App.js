import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line 
} from "recharts";
import Header from "./components/Header";
import Metadata from "./components/Metadata";
import Dots from "./components/Dots";
import bgImage from "./assets/images/bg.svg";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DepartureMono';
    src: url('/assets/fonts/DepartureMono.otf') format('opentype');
  }

  * {
    font-family: 'DepartureMono', monospace;
  }
`;

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #aaaaaa;
  background: 
    url(${bgImage}) no-repeat center center,
    #aaaaaa;
  background-size: cover;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ContentContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
  font-family: 'DepartureMono', monospace;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#8884d8' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.active ? '#8884d8' : '#f0f0f0'};
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableWrapper = styled.div`
  width: 100%;
  margin: 0;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  table-layout: fixed;
`;

const StyledTh = styled.th`
  text-align: left;
  background-color: #8884d8;
  color: white;
  padding: 10px;
  position: sticky;
  top: 0;
  z-index: 1;
  width: 33.33%;
`;

const StyledTd = styled.td`
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [referralsData, setReferralsData] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [activeTab, setActiveTab] = useState('chart');
  const [averageTimeBetweenPresses, setAverageTimeBetweenPresses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query MyQuery {
          timeLefts(orderBy: "blockNumber", orderDirection: "desc", limit: 1000) {
            items {
              blockNumber
              pressedAt
            }
          }
          players(orderBy: "paidTotal", orderDirection: "desc", limit: 100) {
            items {
              playerAddress
              paidTotal
              totalPresses
            }
          }
          referrals(orderBy: "totalReferrals", orderDirection: "desc", limit: 100) {
            items {
              referralAddress
              referralFee
              totalReferrals
            }
          }
          totalPaids {
            items {
              paidTotal
            }
          }
        }
      `;
  
      try {
        const response = await fetch(
          "https://api.ghostlogs.xyz/gg/pub/dea9bbac-4a57-4840-a598-c7555a42818a/ghostgraph",
          {
            headers: {
              "X-GHOST-KEY": "i2wg9eg3cpnjxg1wsjyo7",
              "content-type": "application/json",
            },
            body: JSON.stringify({ query }),
            method: "POST",
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
  
        const json = await response.json();
  
        // Process totalPaids data
        const totalPaidItem = json.data.totalPaids.items[0]?.paidTotal || 0;
        const totalPaidInEth = totalPaidItem / 10 ** 15;
  
        // Process other data as before
        const timeLefts = json.data.timeLefts.items.sort((a, b) => a.blockNumber - b.blockNumber);
        const formattedChartData = timeLefts.map((item, index) => {
          const pressedAtCurrent = item.pressedAt;
          const pressedAtPrevious = index > 0 ? timeLefts[index - 1].pressedAt : null;
  
          return {
            blockNumber: item.blockNumber,
            pressedAt: pressedAtPrevious
              ? pressedAtCurrent - pressedAtPrevious
              : null, // First item has no previous value
          };
        }).filter((item) => item.pressedAt !== null); // Remove invalid points
  
        const players = json.data.players.items.map((player) => ({
          playerAddress: player.playerAddress,
          paidTotal: player.paidTotal / 10 ** 18, // Adjust for Power(10, 18)
          totalPresses: player.totalPresses,
        }));
  
        const referrals = json.data.referrals.items.map((referral) => ({
          referralAddress: referral.referralAddress,
          referralFee: referral.referralFee / 10 ** 18, // Adjust for Power(10, 18)
          totalReferrals: referral.totalReferrals,
        }));
  
        setChartData(formattedChartData);
        setPlayersData(players);
        setReferralsData(referrals);
  
        // Pass totalPaidInEth to Metadata
        setTotalPaid(totalPaidInEth);

        // Calculate average
        const averageTimeBetweenPresses = formattedChartData.reduce((sum, item) => sum + item.pressedAt, 0) / formattedChartData.length;
        setAverageTimeBetweenPresses(averageTimeBetweenPresses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <AppWrapper>
      <GlobalStyle />
      <Header />
      <Dots />
    
      <Title>The Button: Data</Title>
      {/* Content Section */}
      <ContentContainer>
       
        <TabButtons>
          <TabButton 
            active={activeTab === 'chart'} 
            onClick={() => setActiveTab('chart')}
          >
            Time Difference Chart
          </TabButton>
          <TabButton 
            active={activeTab === 'players'} 
            onClick={() => setActiveTab('players')}
          >
            Players Data
          </TabButton>
          <TabButton 
            active={activeTab === 'referrals'} 
            onClick={() => setActiveTab('referrals')}
          >
            Referrals Data
          </TabButton>
        </TabButtons>

        {activeTab === 'chart' && (
          <ChartWrapper>
            <ResponsiveContainer>
              <BarChart 
                data={chartData}
                margin={{ top: 40, right: 30, bottom: 40, left: 60 }}
              >
                <text
                  x="50%"
                  y="20"
                  fill="#8884d8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Time Between Presses (Avg: {averageTimeBetweenPresses.toFixed(2)}s)
                </text>
                <XAxis 
                  dataKey="blockNumber"
                  label={{ 
                    value: "Block Number", 
                    position: "bottom",
                    offset: 0
                  }}
                />
                <YAxis 
                  dataKey="pressedAt"
                  label={{ 
                    value: "Seconds Between Presses", 
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                    dy: 70
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} seconds`, 'Time Between']}
                  labelFormatter={(label) => `Block: ${label}`}
                />
                <Bar dataKey="pressedAt" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}

        {activeTab === 'players' && (
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Player Address</StyledTh>
                  <StyledTh>Paid Total (ETH)</StyledTh>
                  <StyledTh>Total Presses</StyledTh>
                </tr>
              </thead>
              <tbody>
                {playersData.map((player) => (
                  <tr key={player.playerAddress}>
                    <StyledTd>
                      <StyledLink
                        href={`https://basescan.org/address/${player.playerAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {player.playerAddress}
                      </StyledLink>
                    </StyledTd>
                    <StyledTd>{player.paidTotal.toFixed(3)}</StyledTd>
                    <StyledTd>{player.totalPresses}</StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        )}

        {activeTab === 'referrals' && (
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Referral Address</StyledTh>
                  <StyledTh>Referral Fee (ETH)</StyledTh>
                  <StyledTh>Total Referrals</StyledTh>
                </tr>
              </thead>
              <tbody>
                {referralsData.map((referral) => (
                  <tr key={referral.referralAddress}>
                    <StyledTd>
                      <StyledLink
                        href={`https://basescan.org/address/${referral.referralAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {referral.referralAddress}
                      </StyledLink>
                    </StyledTd>
                    <StyledTd>{referral.referralFee.toFixed(3)}</StyledTd>
                    <StyledTd>{referral.totalReferrals}</StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        )}
      </ContentContainer>
      <Metadata price="0.001"  presses={totalPaid}  lastPress="barf.eth" />
    </AppWrapper>
  );
};

export default App;