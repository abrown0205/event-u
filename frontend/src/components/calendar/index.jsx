import { useState } from "react";
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth
} from "date-fns";
import { takeMonth } from "./generatecalendar.js";
import "./calendar.css";


export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const data = takeMonth(selectedDate)();

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
          <span onClick={() => changeMonth(-1)} className="prevNext">
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
            <div className={`${dayColor(day)}`} key={format(day, "dd")}>
              <span>{format(day, "dd")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
