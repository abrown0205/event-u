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
import EditForm from './EditForm.js'


var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);




export default function FullDay(props) {
    var storage = require('../tokenStorage.js');
    var testArr = [];
    var bp = require('./Path.js');
    //buildpath
    const app_name = 'event-u'
    const currentUser = ud.username;

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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [title, setTitle] = useState("notSetBro");
    const [event, setEvent] = useState(null);
    
    


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

    //Likes
    var testArr = [];

    function handleLike(itemId)
    {
        var _userd = localStorage.getItem('user_data');        
        var userd = JSON.parse(_userd);
        var likedEvents = userd.likedEvents;
        if(likedEvents.includes(itemId)) { // remove the item from likes if it is there
            for(var i = 0; i < likedEvents.length; i++) {
                if( likedEvents[i] === itemId) {
                    likedEvents.splice(i, 1);
                }
            }
        }
        else { // add it if it isnt
            likedEvents.push(itemId);
        }

        testArr = likedEvents;
        addLike();
    }

    const addLike = async event =>
    {
        var obj = {username:ud.username,likedEvents:testArr};
        var js = JSON.stringify(obj);
        var config =
        {
            method: 'post',
            url: bp.buildPath('api/users/likes'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        await axios(config)
            .then(function (response) {
                var res = response.data;
                if(res.error) {
                    console.log(res.error);
                }
                else {
                    storage.storeToken(res);
                    
                    var user = {firstName:ud.firstName,lastName:ud.lastName,preferences:ud.preferences,username:ud.username,likedEvents:testArr};
                    localStorage.setItem('user_data', JSON.stringify(user));
                    _ud = localStorage.getItem('user_data');
                    ud = JSON.parse(_ud);
                }
            }) 
    }
    
    

   

    return(
        <div>
            <div>            
            {/* delete dialog */}
            <ConfirmDelete 
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <h1>{format(parseISO(props.date), "MMMM dd")}</h1><br />
            <button className="calendarButton" onClick={ () => setIsAddOpen(!isAddOpen)}>add event</button><br/><br/>
            <ul className="fullEventList">
            {
                calEvents.map(event => 
                    <li key={event._id} className="fullListItem">
                        <h2>{event.title} </h2>
                        <button className="calendarButton" onClick={ () => {
                                handleLike.bind(null, event._id);
                                console.log(event.likes);
                            }
                        }>like</button>

                        {/* edit button displays if creator */}
                        {currentUser === event.createdBy &&  
                            <button className="calendarButton" onClick={ () => {                                     
                                    setIsEditOpen(!isEditOpen);
                                    setEvent(event);
                                }}>edit</button>
                        }
                        

                        {/* delete button displays if creator */}
                        {currentUser === event.createdBy && 
                            <button 
                                className="calendarButton" 
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
                        
                        {(event.likes === undefined) ? <div>likes 0<br /></div> : <div>likes {event.likes}<br /></div>}
                        capacity {event.capacity}<br /><br />

                        
                        
                        
                        
                    </li>        
                )
            }
            </ul>
            </div>

            {/* Add Event Form */}
            {isAddOpen ? 
            <div style={{top: "300px"}}>
                <AddForm/>
            </div>
            : null}

            {/* Edit Event Form */}
            {isEditOpen ? 
            <div style={{top: "300px"}}>                
                <EditForm event={event}/>
            </div>
            : null}

        </div>
    );

}