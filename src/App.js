import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Header from "./components/Header";
import Metadata from "./components/Metadata";
import Dots from "./components/Dots";
import bgImage from "./assets/images/bg.svg";

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
`;

const ChartWrapper = styled.div`
  width: 80%;
  height: 400px;
  margin-top: 20px;
`;

const TableWrapper = styled.div`
  width: 80%;
  margin: 20px auto;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTh = styled.th`
  text-align: left;
  background-color: #8884d8;
  color: white;
  padding: 10px;
`;

const StyledTd = styled.td`
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
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

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query MyQuery {
          timeLefts(orderBy: "blockNumber", orderDirection: "desc", limit: 500) {
            items {
              blockNumber
              pressedAt
            }
          }
          players(orderBy: "paidTotal", orderDirection: "desc", limit: 20) {
            items {
              playerAddress
              paidTotal
              totalPresses
            }
          }
          referrals(orderBy: "totalReferrals", orderDirection: "desc", limit: 20) {
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
        const totalPaidInEth = totalPaidItem / 10 ** 1;
  
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <AppWrapper>
      <Header />
      <Dots />
      <Metadata price="0.001"  presses={totalPaid}  lastPress="barf.eth" />

      {/* Chart Section */}
      <ChartWrapper>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis
              dataKey="blockNumber"
              label={{ value: "Block Number", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              dataKey="pressedAt"
              label={{ value: "Time Difference", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="pressedAt" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Players Table Section */}
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

      {/* Referrals Table Section */}
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
                <StyledTd>{referral.referralFee.toFixed(6)}</StyledTd>
                <StyledTd>{referral.totalReferrals}</StyledTd>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </AppWrapper>
  );
};

export default App;