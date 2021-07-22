import './css/home.css';
import { faPlus, faTimesCircle, faRunning, faFlask, faUserGraduate, faPalette, faGuitar, faShoppingBag, faSearch, faHeart, faSync } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);

const initialList = [];


// function AddEvent() {
//     // this will redirect you to the page for adding events
//     // window.location.href="http://localhost:3000";
// }





function Events() {
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');
    var testArr = [];

    const [name, setName] = useState('');

    const [contentStatus, displayContent] = React.useState(false);

    const contentProps = useSpring({
        opacity: contentStatus ? 1 : 0,
        marginTop: contentStatus ? 295 : -1000
    })

    const [editStatus, displayEdit] = React.useState(false);
    const editProps = useSpring ({
        opacity: editStatus ? 1 : 0,
        marginTop: editStatus ? -250 : -1000
    })

    const [userEvents, setUserEvents] = useState([]);
    //var userLiked = ud.likedEvents;

    var createdBy = ud.username;
    const [eventToDelete, setEventToDelete] = useState('');
    const [values, setValues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [category, setCategory] = useState(null);
    const [address, setAddress] = useState(null);
    const [startHour, setStartHour] = useState('12');
    const [startMin, setStartMin] = useState('00');
    const [startAMPM, setStartAMPM] = useState('AM');
    const [startTime, setStartTime] = useState(null);
    const [endHour, setEndHour] = useState('12');
    const [endMin, setEndMin] = useState('00');
    const [endAMPM, setEndAMPM] = useState('AM');
    const [endTime, setEndTime] = useState(null);
    const [description, setDescription] = useState(null);
    const [likes, setLikes] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [eventMsg, setEventMsg] = useState("");
    const [currentId, setCurrentId] = useState();

    const fetchEvents = async event => {
        event.preventDefault();
        var bp = require('./Path.js');
        var storage = require('../tokenStorage.js');
        var jwt = require('jsonwebtoken');

        var userd = jwt.decode(storage.retrieveToken(),{complete:true});
        var userLiked = userd.payload.likedEvents;
        
        var obj = {likedEvents:userLiked};
        var js = JSON.stringify(obj);
        var config =
        {
            method: 'post',
            url: bp.buildPath('api/events/userevents'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        try {
            const result = await axios(config)
                .then(function (response) {
                    var res = response.data;
                    console.log(res);
                    setUserEvents(res);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        catch(e)
        {
            console.log(e);
        }
    }
    
    

    const deleteEvent = async event =>
    {
        var obj = {_id:eventToDelete};
        var js = JSON.stringify(obj);

        var config =
        {
            method: 'post',
            url: bp.buildPath('api/events/delete'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        axios(config)
        .then(function (response) {
            var res = response.data;
            if(res.error) {
                console.log(res.error);
            }
            else {
                console.log(res);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function handleDelete(deleteId) {
        setEventToDelete(deleteId);
        deleteEvent();
    }

    const handleEventUpdate = async (e) => {
        setStartTime(startHour + ":" + startMin + " " + startAMPM);
        setEndTime(endHour + ":" + endMin + " " + endAMPM);
        e.preventDefault();
        if(title === null) {
            setEventMsg("Invalid title");
            return;
        }
        else if(category === null) {
            setEventMsg("No category selected");
            return;
        }
        else if(address === null) {
            setEventMsg("Invalid address");
            return;
        }
        else if(startTime === null) {
            setEventMsg("Invalid start time");
            return;
        }
        else if(endTime === null) {
            setEventMsg("Invalid end time");
            return;
        }
        else if(description === null) {
            setEventMsg("Invalid description");
            return;
        }
        else if(capacity === null) {
            setEventMsg("Insert a capacity");
            return;
        }
        
        const event = currentId;
        const editPayload = {
            title,
            category,
            address,
            lat,
            long,
            startTime,
            endTime,
            createdBy,
            description,
            // likes,
            capacity,
        }
        var obj = {event:event,editPayload};
        var js = JSON.stringify(obj);

        var config =
        {
            method: 'post',
            url: bp.buildPath('api/events/editevent'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        axios(config)
            .then(function (response) {
                var res = response.data;
                if(res.error) {
                    setEventMsg('Unable to submit, try again');
                }
                else {
                    setEventMsg('');
                    displayEdit(a => !a);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSubmit = async (e) => {
        console.log("start time: " + startTime);
        setStartTime(startHour + ":" + startMin + " " + startAMPM);
        setEndTime(endHour + ":" + endMin + " " + endAMPM);
        e.preventDefault();
        if(title === null) {
            setEventMsg("Invalid title");
            return;
        }
        else if(category === null) {
            setEventMsg("No category selected");
            return;
        }
        else if(address === null) {
            setEventMsg("Invalid address");
            return;
        }
        else if(startTime === null) {
            setEventMsg("Invalid start time");
            return;
        }
        else if(endTime === null) {
            setEventMsg("Invalid end time");
            return;
        }
        else if(description === null) {
            setEventMsg("Invalid description");
            return;
        }
        else if(capacity === null) {
            setEventMsg("Insert a capacity");
            return;
        }
        
        
        const newEvent = {
            title,
            category,
            address,
            lat,
            long,
            startTime,
            endTime,
            createdBy,
            description,
            // likes,
            capacity,
        }
        try {
            const url = bp.buildPath("api/events/newevent");

            const res = await axios.post(url, newEvent);
            setEvents([...events, res.data]);
            const addToLike = res.data;
            handleLike(addToLike._id);
            setNewPlace(null);
            setEventMsg('');
            displayContent(a => !a);
        } catch(err) {
            console.log(err)
        }
    };

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();
      
    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });
    
    const handleAddressInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
    };
    
    const handleSelect =
        ({ description }) =>
        () => {
          // When user selects a place, we can replace the keyword without request data from API
          // by setting the second parameter to "false"
          setValue(description, false);
          setAddress(description);
          clearSuggestions();
    
          // Get latitude and longitude via utility functions
          getGeocode({ address: description })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setLat(lat);
                setLong(lng);
            })
            .catch((error) => {
              console.log("Error: ", error);
            });
        };
    
    const renderSuggestions = () =>
        data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
    
        return (
            <li className="addressResults" key={place_id} onClick={handleSelect(suggestion)}>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
        );
    });

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
    
    


    function getIcon(preferenceName)
    {
        if(preferenceName === 'Sports')
            return faRunning;
        else if(preferenceName === 'Science')
            return faFlask;
        else if(preferenceName === 'Studying')
            return faUserGraduate;
        else if(preferenceName === 'Arts & Culture')
            return faPalette;
        else if(preferenceName === 'Music')
            return faGuitar;
        else if(preferenceName === 'Shopping')
            return faShoppingBag;
    }

    function compareIds(x)
    {
        if(x === currentId)
            return true;
        return false;
    }
    
    function handleOpenEdit(itemId, itemAddress, itemTitle, itemCategory, itemCapacity, itemDesc)
    {
        displayEdit(a => !a);
        setCurrentId(itemId);
        setAddress(itemAddress);
        setTitle(itemTitle);
        setCategory(itemCategory);
        setCapacity(itemCapacity);
        setDescription(itemDesc)
    }

    return(
        <div className="myEvents">
            <br /><br /><br />
            <h1 id="eventsHeader">My Events</h1>
            <div id="postContainer" onClick={() => displayContent(a => !a)} value={name}>
                <button id="postButton"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="vl"></div>
            <div className="eventHolder">
                <ul className="eventList">
                    <button className="refreshButton" onClick={fetchEvents}><FontAwesomeIcon icon={faSync} /></button>
                    {userEvents.map((item) => (
                        <li key={item._id} className="catEventItem">
                            <FontAwesomeIcon className="likeIconMyEvents" icon={faHeart} onClick={handleLike.bind(null, item._id)}/>
                            <h1 className="itemTitle"><FontAwesomeIcon className="myEventsIcon" icon={getIcon(item.category)} />{item.title}</h1>
                            <h2 className="itemCreator">Posted by: {item.createdBy}</h2>
                            <h3 className="itemDesc">{item.description}</h3>
                            <h3 className="itemAddress">{item.address}</h3>
                            <h3 className="itemTime">{item.startTime} to {item.endTime}</h3>
                            {(item.createdBy===ud.username) &&
                                <div>
                                    <button className="customBtns" id="editBtn" onClick={handleOpenEdit.bind(null, item._id, item.address, item.title, item.category, item.capacity, item.description)}>Edit</button>
                                    <button className="customBtns" id="deleteBtn" onClick={handleDelete.bind(null, item._id)}>Delete</button>
                                
                                    {compareIds(item._id) && <animated.div className="editEvent" style={editProps}>
                                        <div className="eventPostContainer">
                                            <div className="position">
                                                <div id="closeForm" onClick={() => displayEdit(a => !a)}><FontAwesomeIcon icon={faTimesCircle} /></div>
                                                <form className="eventForm" onSubmit={handleEventUpdate} autoComplete="off">
                                                    <h4 className="form-header">Edit your Event!</h4>
                                                    <label className="label" id="name-label">title: 
                                                        <input 
                                                            type="text" 
                                                            className="input-field" 
                                                            id="name-input" 
                                                            placeholder="Enter title..."
                                                            defaultValue={item.title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                        />
                                                    </label>
                                                    <label className="label" id="cat-label">category:
                                                        <select id="options-list" onChange={(e) => setCategory(e.target.value)}>
                                                            <option id="cat-options" value={null}></option>
                                                            <option id="cat-options" value="Arts & Culture">Arts & Culture</option>
                                                            <option id="cat-options" value="Sports">Sports</option>
                                                            <option id="cat-options" value="Science">Science</option>
                                                            <option id="cat-options" value="Music">Music</option>
                                                            <option id="cat-options" value="Shopping">Shopping</option>
                                                            <option id="cat-options" value="Studying">Studying</option>
                                                        </select>
                                                    </label>
                                                    <label className="label" id="add-label">address:
                                                        <div ref={ref}>
                                                            <input 
                                                            defaultValue={item.address}
                                                            value={value}
                                                            type="text" 
                                                            className="input-field" 
                                                            id="add-input" 
                                                            placeholder="Enter address..."
                                                            onChange={handleAddressInput}
                                                            />
                                                            {status === "OK" && <ul className="addressUl">{renderSuggestions()}</ul>}
                                                        </div>
                                                    </label>
                                                    <label className="label" id="startTime-label">start time:
                                                        <select className="time" defaultValue="12" id="time-hour-select" onChange={(e) => setStartHour(e.target.value)}>
                                                            <option className="time-options" value="12">12</option>
                                                            <option className="time-options" value="1">1</option>
                                                            <option className="time-options" value="2">2</option>
                                                            <option className="time-options" value="3">3</option>
                                                            <option className="time-options" value="4">4</option>
                                                            <option className="time-options" value="5">5</option>
                                                            <option className="time-options" value="6">6</option>
                                                            <option className="time-options" value="7">7</option>
                                                            <option className="time-options" value="1">8</option>
                                                            <option className="time-options" value="9">9</option>
                                                            <option className="time-options" value="10">10</option>
                                                            <option className="time-options" value="11">11</option>
                                                        </select>
                                                        <select className="time" id="time-min-select" defaultValue="00" onChange={(e) => setStartMin(e.target.value)}>
                                                            <option className="time-options" value="00">00</option>
                                                            <option className="time-options" value="01">01</option>
                                                            <option className="time-options" value="02">02</option>
                                                            <option className="time-options" value="03">03</option>
                                                            <option className="time-options" value="04">04</option>
                                                            <option className="time-options" value="05">05</option>
                                                            <option className="time-options" value="06">06</option>
                                                            <option className="time-options" value="07">07</option>
                                                            <option className="time-options" value="08">08</option>
                                                            <option className="time-options" value="09">09</option>
                                                            <option className="time-options" value="10">10</option>
                                                            <option className="time-options" value="00">11</option>
                                                            <option className="time-options" value="01">12</option>
                                                            <option className="time-options" value="02">13</option>
                                                            <option className="time-options" value="03">14</option>
                                                            <option className="time-options" value="04">15</option>
                                                            <option className="time-options" value="05">15</option>
                                                            <option className="time-options" value="06">16</option>
                                                            <option className="time-options" value="07">17</option>
                                                            <option className="time-options" value="08">18</option>
                                                            <option className="time-options" value="09">19</option>
                                                            <option className="time-options" value="10">20</option>
                                                            <option className="time-options" value="00">21</option>
                                                            <option className="time-options" value="01">22</option>
                                                            <option className="time-options" value="02">23</option>
                                                            <option className="time-options" value="03">24</option>
                                                            <option className="time-options" value="04">25</option>
                                                            <option className="time-options" value="05">25</option>
                                                            <option className="time-options" value="06">26</option>
                                                            <option className="time-options" value="07">27</option>
                                                            <option className="time-options" value="08">28</option>
                                                            <option className="time-options" value="09">29</option>
                                                            <option className="time-options" value="10">30</option>
                                                            <option className="time-options" value="00">31</option>
                                                            <option className="time-options" value="01">32</option>
                                                            <option className="time-options" value="02">33</option>
                                                            <option className="time-options" value="03">34</option>
                                                            <option className="time-options" value="04">35</option>
                                                            <option className="time-options" value="05">35</option>
                                                            <option className="time-options" value="06">36</option>
                                                            <option className="time-options" value="07">37</option>
                                                            <option className="time-options" value="08">38</option>
                                                            <option className="time-options" value="09">39</option>
                                                            <option className="time-options" value="10">40</option>
                                                            <option className="time-options" value="00">41</option>
                                                            <option className="time-options" value="01">42</option>
                                                            <option className="time-options" value="02">43</option>
                                                            <option className="time-options" value="03">44</option>
                                                            <option className="time-options" value="04">45</option>
                                                            <option className="time-options" value="05">45</option>
                                                            <option className="time-options" value="06">46</option>
                                                            <option className="time-options" value="07">47</option>
                                                            <option className="time-options" value="08">48</option>
                                                            <option className="time-options" value="09">49</option>
                                                            <option className="time-options" value="10">50</option>
                                                            <option className="time-options" value="00">51</option>
                                                            <option className="time-options" value="01">52</option>
                                                            <option className="time-options" value="02">53</option>
                                                            <option className="time-options" value="03">54</option>
                                                            <option className="time-options" value="04">55</option>
                                                            <option className="time-options" value="05">55</option>
                                                            <option className="time-options" value="06">56</option>
                                                            <option className="time-options" value="07">57</option>
                                                            <option className="time-options" value="08">58</option>
                                                            <option className="time-options" value="09">59</option>
                                                        </select>
                                                        <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setStartAMPM(e.target.value)}>
                                                            <option className="time-options" value="AM">AM</option>
                                                            <option className="time-options" value="PM">PM</option>
                                                        </select>
                                                    </label>
                                                    <label className="label" id="endTime-label">end time:
                                                        <select className="time" id="time-hour-select" defaultValue="12" onChange={(e) => setEndHour(e.target.value)}>
                                                            <option className="time-options" value="12">12</option>
                                                            <option className="time-options" value="1">1</option>
                                                            <option className="time-options" value="2">2</option>
                                                            <option className="time-options" value="3">3</option>
                                                            <option className="time-options" value="4">4</option>
                                                            <option className="time-options" value="5">5</option>
                                                            <option className="time-options" value="6">6</option>
                                                            <option className="time-options" value="7">7</option>
                                                            <option className="time-options" value="1">8</option>
                                                            <option className="time-options" value="9">9</option>
                                                            <option className="time-options" value="10">10</option>
                                                            <option className="time-options" value="11">11</option>
                                                        </select>
                                                        <select className="time" id="time-min-select" defaultValue="00" onChange={(e) => setEndMin(e.target.value)}>
                                                            <option className="time-options" value="00">00</option>
                                                            <option className="time-options" value="01">01</option>
                                                            <option className="time-options" value="02">02</option>
                                                            <option className="time-options" value="03">03</option>
                                                            <option className="time-options" value="04">04</option>
                                                            <option className="time-options" value="05">05</option>
                                                            <option className="time-options" value="06">06</option>
                                                            <option className="time-options" value="07">07</option>
                                                            <option className="time-options" value="08">08</option>
                                                            <option className="time-options" value="09">09</option>
                                                            <option className="time-options" value="10">10</option>
                                                            <option className="time-options" value="00">11</option>
                                                            <option className="time-options" value="01">12</option>
                                                            <option className="time-options" value="02">13</option>
                                                            <option className="time-options" value="03">14</option>
                                                            <option className="time-options" value="04">15</option>
                                                            <option className="time-options" value="05">15</option>
                                                            <option className="time-options" value="06">16</option>
                                                            <option className="time-options" value="07">17</option>
                                                            <option className="time-options" value="08">18</option>
                                                            <option className="time-options" value="09">19</option>
                                                            <option className="time-options" value="10">20</option>
                                                            <option className="time-options" value="00">21</option>
                                                            <option className="time-options" value="01">22</option>
                                                            <option className="time-options" value="02">23</option>
                                                            <option className="time-options" value="03">24</option>
                                                            <option className="time-options" value="04">25</option>
                                                            <option className="time-options" value="05">25</option>
                                                            <option className="time-options" value="06">26</option>
                                                            <option className="time-options" value="07">27</option>
                                                            <option className="time-options" value="08">28</option>
                                                            <option className="time-options" value="09">29</option>
                                                            <option className="time-options" value="10">30</option>
                                                            <option className="time-options" value="00">31</option>
                                                            <option className="time-options" value="01">32</option>
                                                            <option className="time-options" value="02">33</option>
                                                            <option className="time-options" value="03">34</option>
                                                            <option className="time-options" value="04">35</option>
                                                            <option className="time-options" value="05">35</option>
                                                            <option className="time-options" value="06">36</option>
                                                            <option className="time-options" value="07">37</option>
                                                            <option className="time-options" value="08">38</option>
                                                            <option className="time-options" value="09">39</option>
                                                            <option className="time-options" value="10">40</option>
                                                            <option className="time-options" value="00">41</option>
                                                            <option className="time-options" value="01">42</option>
                                                            <option className="time-options" value="02">43</option>
                                                            <option className="time-options" value="03">44</option>
                                                            <option className="time-options" value="04">45</option>
                                                            <option className="time-options" value="05">45</option>
                                                            <option className="time-options" value="06">46</option>
                                                            <option className="time-options" value="07">47</option>
                                                            <option className="time-options" value="08">48</option>
                                                            <option className="time-options" value="09">49</option>
                                                            <option className="time-options" value="10">50</option>
                                                            <option className="time-options" value="00">51</option>
                                                            <option className="time-options" value="01">52</option>
                                                            <option className="time-options" value="02">53</option>
                                                            <option className="time-options" value="03">54</option>
                                                            <option className="time-options" value="04">55</option>
                                                            <option className="time-options" value="05">55</option>
                                                            <option className="time-options" value="06">56</option>
                                                            <option className="time-options" value="07">57</option>
                                                            <option className="time-options" value="08">58</option>
                                                            <option className="time-options" value="09">59</option>
                                                        </select>
                                                        <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setEndAMPM(e.target.value)}>
                                                            <option className="time-options" value="AM">AM</option>
                                                            <option className="time-options" value="PM">PM</option>
                                                        </select>
                                                    </label>
                                                    <label className="label" id="desc-label" >description:</label>
                                                    <textarea 
                                                        id="comment-box" 
                                                        defaultValue={item.description}
                                                        placeholder="Comments..." 
                                                        rows="9" 
                                                        cols="40"
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                    <label className="label" id="cap-label">capacity:
                                                        <input 
                                                            defaultValue={item.capacity}
                                                            type="number" 
                                                            className="input-field" 
                                                            id="cap-input" 
                                                            min="0"
                                                            onChange={(e) => setCapacity(e.target.value)}
                                                        />
                                                    </label>
                                                    <div className="submitContainer">
                                                        <button type ="submit" id="submitEvent">Add Event</button>
                                                    </div>
                                                    <span className="eventError">{eventMsg}</span>
                                                </form>
                                            </div>
                                        </div>
                                    </animated.div>}
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            
            
            <animated.div className="addEvent" style={contentProps}>
                <div className="eventPostContainer">
                    <div className="position">
                        <div id="closeForm" onClick={() => displayContent(a => !a)}><FontAwesomeIcon icon={faTimesCircle} /></div>
                        <form className="eventForm" onSubmit={handleSubmit} autoComplete="off">
                            <h4 className="form-header">Add an Event!</h4>
                            <label className="label" id="name-label">title: 
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    id="name-input" 
                                    placeholder="Enter title..."
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                            <label className="label" id="cat-label">category:
                                <select id="options-list" onChange={(e) => setCategory(e.target.value)}>
                                    <option id="cat-options" value={null}></option>
                                    <option id="cat-options" value="Arts & Culture">Arts & Culture</option>
                                    <option id="cat-options" value="Sports">Sports</option>
                                    <option id="cat-options" value="Science">Science</option>
                                    <option id="cat-options" value="Music">Music</option>
                                    <option id="cat-options" value="Shopping">Shopping</option>
                                    <option id="cat-options" value="Studying">Studying</option>
                                </select>
                            </label>
                            <label className="label" id="add-label">address:
                                <div ref={ref}>
                                    <input 
                                    type="text" 
                                    className="input-field" 
                                    id="add-input" 
                                    placeholder="Enter address..."
                                    onChange={handleAddressInput}
                                    />
                                    {status === "OK" && <ul className="addressUl">{renderSuggestions()}</ul>}
                                </div>
                            </label>
                            <label className="label" id="startTime-label">start time:
                                <select className="time" defaultValue="12" id="time-hour-select" onChange={(e) => setStartHour(e.target.value)}>
                                    <option className="time-options" value="12">12</option>
                                    <option className="time-options" value="1">1</option>
                                    <option className="time-options" value="2">2</option>
                                    <option className="time-options" value="3">3</option>
                                    <option className="time-options" value="4">4</option>
                                    <option className="time-options" value="5">5</option>
                                    <option className="time-options" value="6">6</option>
                                    <option className="time-options" value="7">7</option>
                                    <option className="time-options" value="1">8</option>
                                    <option className="time-options" value="9">9</option>
                                    <option className="time-options" value="10">10</option>
                                    <option className="time-options" value="11">11</option>
                                </select>
                                <select className="time" id="time-min-select" defaultValue="00" onChange={(e) => setStartMin(e.target.value)}>
                                    <option className="time-options" value="00">00</option>
                                    <option className="time-options" value="01">01</option>
                                    <option className="time-options" value="02">02</option>
                                    <option className="time-options" value="03">03</option>
                                    <option className="time-options" value="04">04</option>
                                    <option className="time-options" value="05">05</option>
                                    <option className="time-options" value="06">06</option>
                                    <option className="time-options" value="07">07</option>
                                    <option className="time-options" value="08">08</option>
                                    <option className="time-options" value="09">09</option>
                                    <option className="time-options" value="10">10</option>
                                    <option className="time-options" value="00">11</option>
                                    <option className="time-options" value="01">12</option>
                                    <option className="time-options" value="02">13</option>
                                    <option className="time-options" value="03">14</option>
                                    <option className="time-options" value="04">15</option>
                                    <option className="time-options" value="05">15</option>
                                    <option className="time-options" value="06">16</option>
                                    <option className="time-options" value="07">17</option>
                                    <option className="time-options" value="08">18</option>
                                    <option className="time-options" value="09">19</option>
                                    <option className="time-options" value="10">20</option>
                                    <option className="time-options" value="00">21</option>
                                    <option className="time-options" value="01">22</option>
                                    <option className="time-options" value="02">23</option>
                                    <option className="time-options" value="03">24</option>
                                    <option className="time-options" value="04">25</option>
                                    <option className="time-options" value="05">25</option>
                                    <option className="time-options" value="06">26</option>
                                    <option className="time-options" value="07">27</option>
                                    <option className="time-options" value="08">28</option>
                                    <option className="time-options" value="09">29</option>
                                    <option className="time-options" value="10">30</option>
                                    <option className="time-options" value="00">31</option>
                                    <option className="time-options" value="01">32</option>
                                    <option className="time-options" value="02">33</option>
                                    <option className="time-options" value="03">34</option>
                                    <option className="time-options" value="04">35</option>
                                    <option className="time-options" value="05">35</option>
                                    <option className="time-options" value="06">36</option>
                                    <option className="time-options" value="07">37</option>
                                    <option className="time-options" value="08">38</option>
                                    <option className="time-options" value="09">39</option>
                                    <option className="time-options" value="10">40</option>
                                    <option className="time-options" value="00">41</option>
                                    <option className="time-options" value="01">42</option>
                                    <option className="time-options" value="02">43</option>
                                    <option className="time-options" value="03">44</option>
                                    <option className="time-options" value="04">45</option>
                                    <option className="time-options" value="05">45</option>
                                    <option className="time-options" value="06">46</option>
                                    <option className="time-options" value="07">47</option>
                                    <option className="time-options" value="08">48</option>
                                    <option className="time-options" value="09">49</option>
                                    <option className="time-options" value="10">50</option>
                                    <option className="time-options" value="00">51</option>
                                    <option className="time-options" value="01">52</option>
                                    <option className="time-options" value="02">53</option>
                                    <option className="time-options" value="03">54</option>
                                    <option className="time-options" value="04">55</option>
                                    <option className="time-options" value="05">55</option>
                                    <option className="time-options" value="06">56</option>
                                    <option className="time-options" value="07">57</option>
                                    <option className="time-options" value="08">58</option>
                                    <option className="time-options" value="09">59</option>
                                </select>
                                <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setStartAMPM(e.target.value)}>
                                    <option className="time-options" value="AM">AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select>
                            </label>
                            <label className="label" id="endTime-label">end time:
                                <select className="time" id="time-hour-select" defaultValue="12" onChange={(e) => setEndHour(e.target.value)}>
                                    <option className="time-options" value="12">12</option>
                                    <option className="time-options" value="1">1</option>
                                    <option className="time-options" value="2">2</option>
                                    <option className="time-options" value="3">3</option>
                                    <option className="time-options" value="4">4</option>
                                    <option className="time-options" value="5">5</option>
                                    <option className="time-options" value="6">6</option>
                                    <option className="time-options" value="7">7</option>
                                    <option className="time-options" value="1">8</option>
                                    <option className="time-options" value="9">9</option>
                                    <option className="time-options" value="10">10</option>
                                    <option className="time-options" value="11">11</option>
                                </select>
                                <select className="time" id="time-min-select" defaultValue="00" onChange={(e) => setEndMin(e.target.value)}>
                                    <option className="time-options" value="00">00</option>
                                    <option className="time-options" value="01">01</option>
                                    <option className="time-options" value="02">02</option>
                                    <option className="time-options" value="03">03</option>
                                    <option className="time-options" value="04">04</option>
                                    <option className="time-options" value="05">05</option>
                                    <option className="time-options" value="06">06</option>
                                    <option className="time-options" value="07">07</option>
                                    <option className="time-options" value="08">08</option>
                                    <option className="time-options" value="09">09</option>
                                    <option className="time-options" value="10">10</option>
                                    <option className="time-options" value="00">11</option>
                                    <option className="time-options" value="01">12</option>
                                    <option className="time-options" value="02">13</option>
                                    <option className="time-options" value="03">14</option>
                                    <option className="time-options" value="04">15</option>
                                    <option className="time-options" value="05">15</option>
                                    <option className="time-options" value="06">16</option>
                                    <option className="time-options" value="07">17</option>
                                    <option className="time-options" value="08">18</option>
                                    <option className="time-options" value="09">19</option>
                                    <option className="time-options" value="10">20</option>
                                    <option className="time-options" value="00">21</option>
                                    <option className="time-options" value="01">22</option>
                                    <option className="time-options" value="02">23</option>
                                    <option className="time-options" value="03">24</option>
                                    <option className="time-options" value="04">25</option>
                                    <option className="time-options" value="05">25</option>
                                    <option className="time-options" value="06">26</option>
                                    <option className="time-options" value="07">27</option>
                                    <option className="time-options" value="08">28</option>
                                    <option className="time-options" value="09">29</option>
                                    <option className="time-options" value="10">30</option>
                                    <option className="time-options" value="00">31</option>
                                    <option className="time-options" value="01">32</option>
                                    <option className="time-options" value="02">33</option>
                                    <option className="time-options" value="03">34</option>
                                    <option className="time-options" value="04">35</option>
                                    <option className="time-options" value="05">35</option>
                                    <option className="time-options" value="06">36</option>
                                    <option className="time-options" value="07">37</option>
                                    <option className="time-options" value="08">38</option>
                                    <option className="time-options" value="09">39</option>
                                    <option className="time-options" value="10">40</option>
                                    <option className="time-options" value="00">41</option>
                                    <option className="time-options" value="01">42</option>
                                    <option className="time-options" value="02">43</option>
                                    <option className="time-options" value="03">44</option>
                                    <option className="time-options" value="04">45</option>
                                    <option className="time-options" value="05">45</option>
                                    <option className="time-options" value="06">46</option>
                                    <option className="time-options" value="07">47</option>
                                    <option className="time-options" value="08">48</option>
                                    <option className="time-options" value="09">49</option>
                                    <option className="time-options" value="10">50</option>
                                    <option className="time-options" value="00">51</option>
                                    <option className="time-options" value="01">52</option>
                                    <option className="time-options" value="02">53</option>
                                    <option className="time-options" value="03">54</option>
                                    <option className="time-options" value="04">55</option>
                                    <option className="time-options" value="05">55</option>
                                    <option className="time-options" value="06">56</option>
                                    <option className="time-options" value="07">57</option>
                                    <option className="time-options" value="08">58</option>
                                    <option className="time-options" value="09">59</option>
                                </select>
                                <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setEndAMPM(e.target.value)}>
                                    <option className="time-options" value="AM">AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select>
                            </label>
                            <label className="label" id="desc-label" >description:</label>
                            <textarea 
                                id="comment-box" 
                                placeholder="Comments..." 
                                rows="9" 
                                cols="40"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <label className="label" id="cap-label">capacity:
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    id="cap-input" 
                                    min="0"
                                    onChange={(e) => setCapacity(e.target.value)}
                                />
                            </label>
                            <div className="submitContainer">
                                <button type ="submit" id="submitEvent">Add Event</button>
                            </div>
                            <span className="eventError">{eventMsg}</span>
                        </form>
                    </div>
                </div>
            </animated.div>
            
        </div>
    );
};

function OngoingEvents() {
    var testArr = []; // had to implement this because react fucking sucks
                      // not changing the name, but it's final

    const [contentStatus, displayContent] = React.useState(false);
    const [resultList, setResultList] = useState([]);
    const [category, setCategory] = useState('');
    const [edit, setEdit] = useState(false);
    const contentProps = useSpring({
        opacity: contentStatus ? 1 : 0,
    });
    const [likeColor, setLikeColor] = useState();

    var currentCat = '';

    var resultArr = [];

    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');
    const jwt = require("jsonwebtoken");

    const loadCategories = async event =>
    {
        if(currentCat === "arts & culture") {
            currentCat = "Arts & Culture";
        }
        else {
            currentCat = currentCat.charAt(0).toUpperCase() + currentCat.slice(1);
        }
        var tok = storage.retrieveToken();
        var obj = {category:currentCat};
        var js = JSON.stringify(obj);
        var config =
        {
            method: 'post',
            url: bp.buildPath('api/events/findcat'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }
        try {
            const result = await axios(config)
            .then(function (response) {
                var res = response.data;
                
                for(var i = 0; i < res.length; i++) {
                    resultArr.push(res[i]);
                }

                setResultList(resultArr);
                //setResultList(res);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
        catch(e)
        {
            console.log(e);
        }
    };

    function handleOpenCategory(preferenceName) {
        var cat = preferenceName.preference;
        currentCat = cat;
        setCategory(currentCat);
        loadCategories();
        if(contentStatus == false)
            displayContent(a => !a);
    }

    var preferences = [];
    for(var i = 0; i < ud.preferences.length; i++) {
        preferences.push(ud.preferences[i]);
    }

    function getIcon(preferenceName) {
        preferenceName = preferenceName.preference;
        if(preferenceName === 'Sports')
            return faRunning;
        else if(preferenceName === 'Science')
            return faFlask;
        else if(preferenceName === 'Studying')
            return faUserGraduate;
        else if(preferenceName === 'Arts & Culture')
            return faPalette;
        else if(preferenceName === 'Music')
            return faGuitar;
        else if(preferenceName === 'Shopping')
            return faShoppingBag;
    }

    const listCategories = preferences.map((preference) =>
        <li className="eventItem" onClick={ () => handleOpenCategory({preference}) } key={preference}><h1 className="catText">{preference}<FontAwesomeIcon className="categoryIcon" icon={getIcon({preference})} /></h1></li>
    );

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

    
    return (
        <div id="ongoing-Events">
            <ul className="ongoing-List">
                {listCategories}
                <li className="eventItem"><h1 className="catText">Search</h1><FontAwesomeIcon className="categoryIcon" icon={faSearch} /></li>
            </ul><br />
            <animated.div className="categoryList" style={contentProps}>
                <div id="categoryContainer">
                    <div id="closeFormNearby" onClick={() => displayContent(a => !a)}><FontAwesomeIcon icon={faTimesCircle} /></div>
                    <h1 className="listHeader">{category}</h1>
                    <ul className="catEventList">
                        {resultList.map((item) => (
                            <li key={item._id} className="catEventItem">
                                <div className="listInfo">
                                    <FontAwesomeIcon className="likeIcon" icon={faHeart} style={likeColor} onClick={handleLike.bind(null, item._id)}/>
                                    <h1 className="itemTitle">{item.title}</h1>
                                    <h2 className="itemCreator">Posted by: {item.createdBy}</h2>
                                    <h3 className="itemDesc">{item.description}</h3>
                                    <h3 className="itemAddress">{item.address}</h3>
                                    <h3 className="itemTime">{item.startTime} to {item.endTime}</h3>
                                    {(item.createdBy===ud.username) &&
                                        <div>
                                            <button className="customBtns" id="editBtn">Edit</button>
                                            <button className="customBtns" id="deleteBtn">Delete</button>
                                        </div>
                                    }
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </animated.div>
        </div>
    );
}

function HomePage() {
    return(
        <div>
            <TopNav />
            <Events />
            <div className="nearbyEvents">
                <h1 id="ongoing">Events Near U</h1>
                <OngoingEvents />
            </div>
        </div>
    );
};

function Home()
{
    return(
        <div className="HomePage">
            <div className="homeBg">
                <HomePage />
            </div>
        </div>
    );
};

export default Home;