import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import {
  addDays,
  format,
  parseISO,
} from "date-fns";

import "./css/calendar.css";

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);



export default function FullDay(props) {
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

    const deleteEvent = (eventid) => {

        console.log("clicked on delete" + eventid);
        alert("delete the event" + eventid);
        try{
            axios.post(buildPath('api/events/delete/'),
            {
                _id : eventid
            }
            );
            
        } catch(err) {
            console.log(err);
        }
        

    }

    function isCreator(username){
        var storedUsername = ud.username;
        console.log("ud:" + storedUsername);
        console.log("event creator: " + username);
        if(storedUsername === username)return(true);
        
    }

    return(
        <div>
        <h1>{format(parseISO(props.date), "MMMM dd")}</h1><br />
        <button>add event {ud.username}</button><br/><br/>
        <ul className="fullEventList">
        {
            events.map(event => 
                <li key={event._id} className="fullListItem">
                    <h2>{event.title} </h2>
                    <button>like</button> 
                    <button>edit</button>
                    <button onClick={ () => {deleteEvent(event._id)} }>
                        delete
                    </button>                     
                    <br/>
                    {format(parseISO(event.startTime), formatEventDate)}&nbsp;-&nbsp; 
                    {format(parseISO(event.endTime), formatEventDate)} <br/> 
                    {event.address}<br />
                    {event.description}<br />
                    created by {event.createdBy}<br />
                    likes {event.likes}<br />
                    capacity {event.capacity}<br />
                    
                    
                </li>        
            )
        }
        </ul>
    </div>
    );

}