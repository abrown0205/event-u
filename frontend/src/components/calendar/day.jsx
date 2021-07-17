import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import {
  addDays,
  format,
  parseISO
} from "date-fns";

import "./calendar.css";



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
    if(!props.date){
        const date = new Date;
        var startDate = format(date, apiDateFormat);
        var endDate = format(addDays(date, 1), apiDateFormat)
    } else {
        const propDate = parseISO(props.date);
        var startDate = format(propDate, apiDateFormat);
        var endDate = format(addDays(propDate, 1), apiDateFormat);
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
  

  
    return (

        <div>
            <ul className="eventList">
        { 
            events.map(event => 
            <li key={event._id}>{format(parseISO(event.startTime), formatEventDate)} <br/> {event.title}</li>

            ) 
        }
            </ul>
        </div>
    )   
  
}

