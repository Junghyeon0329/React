import React, { useState, useEffect } from 'react';
import './ClockTimer.css';

const timezones = {
  "한국": "Asia/Seoul",
  "미국": "America/New_York",
  "대만": "Asia/Taipei",
};

function ClockTimer() {
  const [timezone, setTimezone] = useState(timezones["한국"]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(time);

  return (
    <div className="grid-item ClockTimer">      
      <div className="calendar-title">
        <h1>현재 시각</h1>
      </div>
      <div className="clock-layout">
        <div className="timezone-buttons">
          {Object.keys(timezones).map((country) => (
            <button key={country} onClick={() => setTimezone(timezones[country])}>
              {country}
            </button>
          ))}
        </div>
        <div className="clock-container">
          <div className="clock">
            <div
              className="hand hour-hand"
              style={{ transform: `rotate(${time.getHours() * 30 + time.getMinutes() * 0.5}deg)` }}
            />
            <div
              className="hand minute-hand"
              style={{ transform: `rotate(${time.getMinutes() * 6}deg)` }}
            />
            <div
              className="hand second-hand"
              style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }}
            />
          </div>
          <div className="time-display">{localTime}</div>
        </div>
      </div>
    </div>
  );
}

export default ClockTimer;