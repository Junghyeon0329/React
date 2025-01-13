import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import moment from 'moment';
import './Calendar.css';

function Calendar() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="grid-item Calendar">      
      <ReactCalendar
        onChange={onChange}
        value={date}
        formatDay={(local, date) => moment(date).format("D")}
        showNeighboringMonth={false}
        view="month"
        locale="ko-KR"
        tileClassName="react-calendar__tile"
        calendarType="gregory"
      />
    </div>
  );
}

export default Calendar;
