import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { faPlus, faTimesCircle, faRunning, faFlask, faUserGraduate, faPalette, faGuitar, faShoppingBag, faSearch, faHeart, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addDays,
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  isBefore,
  isSameMonth,
  isSameDay,
} from "date-fns";

import "./css/calendar.css";
import Day from "./Day.js";
import FullDay from "./FullDay.js";



export default function Month(props) {

    //buildpath
    const app_name = 'event-u'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }
    
    const [isOpen, setIsOpen] = useState(false);
    const [fullDay, setFullDay] = useState(new Date());
    var apiDateFormat = "yyyy-MM-dd";
    var selectedDate;

    if(!props.date){
        selectedDate = startOfDay(new Date());
    } else {
        selectedDate = parseISO(props.date);
    }

    // build calendar array
    let month = [];
    let startDate = startOfWeek(startOfMonth(selectedDate));
    let endDate = endOfWeek(endOfMonth(selectedDate));
    let insertDate = startDate;

    while(isBefore(insertDate, endDate)){
        month.push(insertDate);
        insertDate = addDays(insertDate, 1);
    }

    // dateStack
    addDays(endDate, 1);
    let [events, setEvents] = useState([]);
    let dateStack = [];

    useEffect(() => {
        let getEvents = async () => {
            try{
                const res = await axios.post(buildPath('api/events/inrange/'),
                {
                    start : startDate,
                    end : endDate
                }
                );
                console.log(res.data);
                setEvents(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        getEvents();
    }, [props.date]);
  
    //Push Event Dates to DateStack
    for( let i = 0; i < events.length; i++){
        dateStack.push((events[i].startTime));
    }

    //Only Render Events Day Tiles on Days with Events
    function renderDayEvents(day){
        if(isSameDay(day, parseISO(dateStack[0]) )){
        dateStack.shift();
        //Get rid of all duplicate dates in dateStack
        while(isSameDay(day, parseISO(dateStack[0]) )){
            dateStack.shift();
        }
        return(
            <Day key={day} date={format(day, apiDateFormat)}/>
        );

        }
    }

    function dayColor(day) {
        if (!isSameMonth(day, selectedDate)) return "dayOutsideMonth";
        if (isSameDay(day, new Date())) return "today";
        return "day";
    }


    return (

        <div>
            {isOpen ? <div className="fullday">
                
                <div id="closeFullDay" onClick={() => setIsOpen(!isOpen)}><FontAwesomeIcon icon={faTimesCircle} /></div>
                <FullDay date={format(fullDay, apiDateFormat)} />
                
            </div> : null}

            <div className="calendargrid">

                {/* the weekday headers for the calendar */}

                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                <div className="weekDay" key={dayName}>
                    <span>{dayName}</span>
                </div>
                ))}
                
                {/* Days in the Calendar */}
                {
                    month.map((day) => (
                        <div key={format(day, "y-MM-dd")} onClick={() => {setIsOpen(!isOpen); setFullDay(day)}}>
                        <div className={`${dayColor(day)}`} key={format(day, "yyyy-MM-dd")}>
                            
                            <span>{format(day, "dd")}</span>
                        {/* Event Lists on Day Tiles */}
                        {renderDayEvents(day)}
                            
                        </div>
                        </div>
                        
                    ))


                }
            </div>
         </div>
    )
}