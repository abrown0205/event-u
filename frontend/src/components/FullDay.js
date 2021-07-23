import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { faPlus, faTimesCircle, faRunning, faFlask, faUserGraduate, faPalette, faGuitar, faShoppingBag, faSearch, faHeart, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addDays,
  format,
  parseISO,
} from "date-fns";

import "./css/calendar.css";
import useOnclickOutside from "react-cool-onclickoutside";
import ConfirmDelete from './ConfirmDelete.js';
import AddForm from './AddForm.js'


var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);
const currentUser = ud.username;



export default function FullDay(props) {
    var storage = require('../tokenStorage.js');
    var testArr = [];
    var bp = require('./Path.js');
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

    var createdBy = ud.username;
    const [calEvents, setCalEvents] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, 
        title: '', 
        subTitle: ''
    })
    const [isAddOpen, setIsAddOpen] = useState(false);
    
    


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

    //get events for the full day panel
    useEffect(() => {
        const getCalEvents = async () => {
            try{
                const res = await axios.post(buildPath('api/events/inrange/'),
                {
                    start : startDate,
                    end : endDate
                }
                );
                console.log(res.data);
                setCalEvents(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        getCalEvents();
    }, []);

    

    // Deletes an event 
    const handleDelete = async (id) => {
        // console.log("id: " + id);
        const eventDelete = {
            _id: id,
        }

        try {
            const url = buildPath("api/events/delete");
            const res = await axios.post(url, eventDelete);
            console.log("Item successfully deleted");
            setConfirmDialog({
                ...confirmDialog,
                isOpen: false
            })
        }
        catch(err) {
            console.log(err);
        }
    }


    
    

   

    return(
        <div>
            {/* delete dialog */}
            <ConfirmDelete 
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <h1>{format(parseISO(props.date), "MMMM dd")}</h1><br />
            <button onClick={ () => setIsAddOpen(!isAddOpen)}>add event</button><br/><br/>
            <ul className="fullEventList">
            {
                calEvents.map(event => 
                    <li key={event._id} className="fullListItem">
                        <h2>{event.title} </h2>
                        <button>like</button> 
                        <button>edit</button>
                        

                        {/* delete button displays if creator */}
                        {currentUser === event.createdBy && 
                            <button  
                                onClick={() => 
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: 'Are you sure you want to delete this event?',
                                        subtitle: "This event will be deleted",
                                        onConfirm: () => { handleDelete(event._id) }
                                    })
                                }
                            >
                                delete
                            </button>
                        }


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

            {/* Add Event Form */}
            {isAddOpen ? 
            <div>
                <AddForm/>
            </div>
            : null}   
        </div>
    );

}