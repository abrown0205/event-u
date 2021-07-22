import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import {
  addDays,
  format,
  parseISO
} from "date-fns";

import "./calendar.css";

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);



export default function Day(props) {
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


    const [events, setEvents] = useState([]);
    var formatEventDate = "h:mm aaa";
    var apiDateFormat = "yyyy-MM-dd";
    // format(event.startTime, formatEventDate)
    var startDate;
    var endDate;
    if(!props.date){
        const date = new Date();
        startDate = format(date, apiDateFormat);
        endDate = format(addDays(date, 1), apiDateFormat)
    } else {
        const propDate = parseISO(props.date);
        startDate = format(propDate, apiDateFormat);
        endDate = format(addDays(propDate, 1), apiDateFormat);
    }

    
    useEffect(() => {
        const getEvents = async () => {
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
    }, []);


    function listLength(events){
        if(events.length > 2){
            var firstEvents = events.slice(0,3);            
            return(
                firstEvents.map(event => 
                    <li key={event._id}>{format(parseISO(event.startTime), formatEventDate)} <br/> {event.title}</li>     
                )     
            );

        }else{
            return(
                events.map(event => 
                    <li key={event._id}>{format(parseISO(event.startTime), formatEventDate)} <br/> {event.title}</li>        
                )
            );
        }
    }

    // className={`${eventHighlight(event._id)}`}

    function moreEvents(events){
        var moreEvents = events.length - 3;
        if(events.length > 3 && moreEvents > 1){                               
            return(
                <li>and {moreEvents} more events</li>
            );

        }else if(events.length > 3 && moreEvents < 2){
            return(
                <li>and {moreEvents} more event</li>
            );
        }
    }

    // function eventHighlight(_id){
    //     if(ud.attendedEvents.includes(_id)){
    //         return("attendedEvent");
    //     }
    //     else if(ud.likedEvents.includes(_id)){
    //         return("likedEvent");
    //     } else {
    //         return("");
    //     }
    // }
  
    return (
        <div>
            <ul className="eventList">
                {listLength(events)}
                {moreEvents(events)}
            </ul>
        </div>
    )   
  
}

