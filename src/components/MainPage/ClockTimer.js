import React from 'react';
import './ClockTimer.css';

function ClockTimer() {
//   const [date, setDate] = useState(new Date());

//   const onChange = (newDate) => {
//     setDate(newDate);
//   };

  return (
    <div className="grid-item ClockTimer">      
      <div className="calendar-title">
        <h1>현재 시각</h1>
      </div>
      {/* 
      <ReactCalendar
        onChange={onChange}
        value={date}
        formatDay={(local, date) => moment(date).format("D")}
        showNeighboringMonth={false}
        view="month"
        locale="ko-KR"
        tileClassName="react-calendar__tile"
        calendarType="gregory"
      /> */}
    </div>
  );
}

export default ClockTimer;