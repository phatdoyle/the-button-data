import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "pink"};
  position: absolute;
  top: ${(props) => props.top || "0"}%;
  left: ${(props) => props.left || "0"}%;
  transition: top 1s ease, left 1s ease; /* Smooth animation for moving dots */
`;

const Dots = () => {
  const [dots, setDots] = useState([]);

  // Initialize the dots on the screen
  useEffect(() => {
    const generateDots = () => {
      let initialDots = [];
      for (let i = 0; i < 30; i++) {
        initialDots.push({
          id: i,
          top: Math.random() * 100,
          left: Math.random() * 100,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
      }
      setDots(initialDots);
    };
    generateDots();
  }, []);

  // Move one random dot every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        // Select a random dot to move
        const randomIndex = Math.floor(Math.random() * prevDots.length);
        const updatedDots = prevDots.map((dot, index) => {
          if (index === randomIndex) {
            return {
              ...dot,
              top: Math.random() * 100, // Random new position for top
              left: Math.random() * 100, // Random new position for left
            };
          }
          return dot;
        });
        return updatedDots;
      });
    }, 1000); // Move one dot every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      {dots.map((dot) => (
        <Dot key={dot.id} top={dot.top} left={dot.left} color={dot.color} />
      ))}
    </>
  );
};

export default React.memo(Dots); // Correctly wrap the functional component with React.memo