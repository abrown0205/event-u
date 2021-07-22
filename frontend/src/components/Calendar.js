import { useState} from 'react';
import {
  addMonths,
  format,
  startOfMonth
} from "date-fns";
import "./css/calendar.css";
import Month from './Month.js';
import TopNav from './TopNav';


export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  var apiDateFormat = "yyyy-MM-dd";
    

  function changeMonth(addToMonth) {
    setSelectedDate(addMonths(startOfMonth(selectedDate), addToMonth));
    
  }


  return (
    <div className="calendarBg">
        <TopNav />
        <div className="calendarWrapper">
        
        <div className="calendargrid">
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
        </div>
            
        <Month key={format(selectedDate, apiDateFormat)} date={format(selectedDate, apiDateFormat)}/>

        </div>
    </div>
  );
}
