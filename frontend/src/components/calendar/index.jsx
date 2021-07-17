import { useState, useEffect } from 'react';
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfWeek,
  startOfWeek,
  endOfMonth,
  addDays
} from "date-fns";
import { takeMonth } from "./generatecalendar.js";
import "./calendar.css";
import Day from './day.jsx';
import axios from "axios";
import parseISO from 'date-fns/esm/fp/parseISO/index.js';


export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const data = takeMonth(selectedDate)();
  var apiDateFormat = "yyyy-MM-dd";

  

  function changeMonth(addToMonth) {
    setSelectedDate(addMonths(startOfMonth(selectedDate), addToMonth));
    
  }

  function dayColor(day) {
    if (!isSameMonth(day, selectedDate)) return "dayOutsideMonth";
    if (isSameDay(day, new Date())) return "today";
    return "day";
  }

  


  return (
    
    <div className="calendarWrapper">
      <div className="calendargrid">
        {/* the top title and navigation of the calendar */}

        <div className="calendarPrevNext">
          <span onClick={() => changeMonth(-1) } className="prevNext">
            &lt;&lt;
          </span>
        </div>
        <div className="calendarTitle">
          <span className="title">
            {format(selectedDate, "MMMM")} {format(selectedDate, "yyyy")}
          </span>
        </div>
        <div className="calendarPrevNext">
          <span onClick={() => changeMonth(1)} className="prevNext">
            &gt;&gt;
          </span>
        </div>

        {/* the weekday headers for the calendar */}

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div className="weekDay" key={dayName}>
            <span>{dayName}</span>
          </div>
        ))}

        {/* the days in the calendar */}

        {data.map((week) =>
          week.map((day) => (
            <div className={`${dayColor(day)}`} key={format(day, "yyyy-MM-dd")}>
              <span>{format(day, "dd")}</span>
              {/* Event Lists on Day Tiles */}
              <Day key={day} date={format(day, apiDateFormat)}/>            
            </div>
          ))
        )}
      </div>
    </div>
  );
}
