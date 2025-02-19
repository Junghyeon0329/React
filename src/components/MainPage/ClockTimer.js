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

  const timeInTimezoneStr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(time);

  const [month, day, year, hour, minute, second] = timeInTimezoneStr
    .match(/\d+/g)
    .map(Number);
  const timeInTimezone = new Date(year, month - 1, day, hour, minute, second);

  const hourDeg = (timeInTimezone.getHours() % 12) * 30 + timeInTimezone.getMinutes() * 0.5;
  const minuteDeg = timeInTimezone.getMinutes() * 6;
  const secondDeg = timeInTimezone.getSeconds() * 6;

  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
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
            <div className="hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
            <div className="hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
            <div className="hand second-hand" style={{ transform: `rotate(${secondDeg}deg)` }} />
          </div>
          <div className="time-display">{localTime}</div>
        </div>
      </div>
    </div>
  );
}

export default ClockTimer;
