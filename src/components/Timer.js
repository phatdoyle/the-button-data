// components/Timer.js
import React, { useState, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div style={{ fontSize: "2rem", marginTop: "20px" }}>Time: {time}s</div>;
}