import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { useState, useEffect } from 'react';
import "../components/css/map.css";
import { AirportShuttle, Room, Star } from '@material-ui/icons'
import axios from 'axios';
import TopNav from './TopNav.js';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
// import { format } from "timeago.js";
// import { format, formatDistance, formatRelative, subDays } from 'date-fns';

var bp = require('./Path.js');

function Map() {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    const currentUser = ud.username;
    const [values, setValues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [title, setTitle] = useState(null);
    const [category, setCategory] = useState(null);
    const [address, setAddress] = useState(null);
    const [startHour, setStartHour] = useState('12');
    const [startMin, setStartMin] = useState('00');
    const [startAMPM, setStartAMPM] = useState('AM');
    const [startTime, setStartTime] = useState('12:00 AM');
    const [endHour, setEndHour] = useState('12');
    const [endMin, setEndMin] = useState('00');
    const [endAMPM, setEndAMPM] = useState('AM');
    const [endTime, setEndTime] = useState('12:00 AM');
    const [description, setDescription] = useState(null);
    const [like, setLike] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [contentStatus, displayContent] = React.useState(false);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [viewPort, setViewPort] = useState({
        latitude: 28.60236,
        longitude: -81.20008,
        // width: '100vw',
        // height: '100vh',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 14
    });

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

    // gets all the events from the database and displays them on the map
    useEffect(() => {
        const getEvents = async () => {
            try{
                const url = bp.buildPath("api/events/findevent");

                const res = await axios.get(url);
                console.log(res.data);
                console.log("length: " + res.data.length);
                setEvents(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        getEvents();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewPort({...viewPort, latitude: lat, longitude: long, zoom: 16});
    };

    const handleAddClick = (event) => {
        const [long,lat] = event.lngLat;
        setNewPlace({
            lat,
            long,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStartTime(startHour + ":" + startMin + " " + startAMPM);
        setEndTime(endHour + ":" + endMin + " " + endAMPM);
        // console.log("Start hour:" + startHour);
        // console.log("Start Min:" + startMin);
        // console.log("Start AMPM:" + startAMPM);
        // console.log("End hour:" + endHour);
        // console.log("End Min:" + endMin);
        // console.log("End AMPM:" + endAMPM);
        // console.log("Start time: " + startTime);
        // console.log("End time: " + endTime);
        // console.log("Category:" + category);
        // console.log("Hour:" + startHour);
        // console.log("Min:" + startMin);
        // console.log("AM/PM: " + startAMPM);
        const newEvent = {
            title,
            category,
            address,
            lat: newPlace.lat,
            long: newPlace.long,
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
            setNewPlace(null);
        } catch(err) {
            console.log(err)
        }
    }

    // Adds a like to an event
    const onLike = async (e, id, likes) => {
        const likesPlus = likes + 1;
        setLike(likesPlus);
        const addLike = {
            _id: id,
            likes: likesPlus, 
        }
        console.log(e);

        try {
            const url = bp.buildPath("api/events/updateLikes"); 
            const res = await axios.post(url, addLike);
        }
        catch(err) {
            console.log(err)
        }
    }

    // Deletes an event from the map
    const handleDelete = async (id) => {
        // console.log("id: " + id);
        const eventDelete = {
            _id: id,
        }
        
        try {
            const url = bp.buildPath("api/events/delete");
            const res = await axios.post(url, eventDelete);
            console.log("Item successfully deleted");
        }
        catch(err) {
            console.log(err);
        }
    }

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

    return (
        <div className="map">
            <TopNav />
            <ReactMapGL

                // The following three lines of code displays the map along with the appropriate styling.
                mapboxApiAccessToken={"pk.eyJ1IjoiZWxyNDI0IiwiYSI6ImNrcXM5cGdvZTFtbjUybnFsZTF1N2c5bmkifQ.1e0zeu37TrBHe_TiqmjNVw"}
                mapStyle="mapbox://styles/elr424/ckqsacra23gy117r0j9otwx4x"
                {...viewPort}
                
                // Enables the user to move around on the map. Only temporary.
                onViewportChange={(newView) => setViewPort(newView)}
                onDblClick = {handleAddClick}
            >
                {/* Places all events stored in the database onto the map*/}
                {events.map(events =>(
                    <>
                    <Marker
                        latitude={events.lat}
                        longitude={events.long}
                        offsetLeft={-viewPort.zoom*1.5}
                        offsetTop={-viewPort.zoom*3}
                    >
                        <Room
                            style={{
                                fontSize: viewPort.zoom * 3,
                                color: currentUser === events.createdBy ? "#FAED26" : "black",
                                cursor: "pointer"
                            }}
                            onClick={() => handleMarkerClick(events._id, events.lat, events.long)}
                        />
                    </Marker>
                    {events._id == currentPlaceId && (
                    <Popup
                        latitude={events.lat} 
                        longitude={events.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={() => setCurrentPlaceId(null)}
                    >
                        <div className="addEvent-form" id="result-popup">
                            <h4 className="form-header">{events.title}</h4>
                            <label className="result-label">Address</label>
                            <p>{events.address}</p>
                            <p>startTime: {events.startTime}</p>
                            <p>endTime: {events.endTime}</p>
                            <p>capacity: {events.capacity}</p>
                            <label>Description</label>
                            <p>{events.description}</p>
                            <p>createdBy: {events.createdBy}</p>
                            {/* Use the useState above for likes to update the 
                                amount of likes a post has and update the database
                                accordingly */}
                            <button className="res-btn" id="likes-btn" 
                            onClick={() => {onLike(events, events._id, events.likes); setLike(events.likes + 1)}}

                            >likes: {like}</button>
                            <button className="res-btn" id="delete-btn"
                            onClick={() => handleDelete(events._id)}
                            >delete</button>
                        </div>
                    </Popup>
                    )}
                    </>
                ))}
                {newPlace && (
                    <Popup
                        latitude={newPlace.lat} 
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={() => setNewPlace(null)}
                    >
                        <div className="addEvents">
                            <h4 className="form-header">Add an Event!</h4>
                            <form className="addEvent-form" onSubmit={handleSubmit}>
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
                                    <option id="cat-options" value="Music">Music</option>
                                    <option id="cat-options" value="Studying">Studying</option>
                                    <option id="cat-options" value="Arts/Culture">Arts & Culture</option>
                                    <option id="cat-options" value="Shopping">Shopping</option>
                                    <option id="cat-options" value="Science">Science</option>
                                    <option id="cat-options" value="Sports">Sports</option>
                                </select>
                                </label>
                                {/* <label className="label" id="add-label">address:
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    id="add-input" 
                                    placeholder="Enter address..."
                                    onChange={(e) => setAddress(e.target.value)}
                                    ></input>
                                </label> */}
                                <label className="label" id="add-label">address:
                                    <div ref={ref}>
                                        <input 
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
                                <select className="time" id="time-hour-select" onChange={(e) => setStartHour(e.target.value)}>
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
                                <select className="time" id="time-min-select" onChange={(e) => setStartMin(e.target.value)}>
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
                                    <option className="time-options" value="11">11</option>
                                    <option className="time-options" value="12">12</option>
                                    <option className="time-options" value="13">13</option>
                                    <option className="time-options" value="14">14</option>
                                    <option className="time-options" value="15">15</option>
                                    <option className="time-options" value="16">16</option>
                                    <option className="time-options" value="17">17</option>
                                    <option className="time-options" value="18">18</option>
                                    <option className="time-options" value="19">19</option>
                                    <option className="time-options" value="20">20</option>
                                    <option className="time-options" value="21">21</option>
                                    <option className="time-options" value="22">22</option>
                                    <option className="time-options" value="23">23</option>
                                    <option className="time-options" value="24">24</option>
                                    <option className="time-options" value="25">25</option>
                                    <option className="time-options" value="26">26</option>
                                    <option className="time-options" value="27">27</option>
                                    <option className="time-options" value="28">28</option>
                                    <option className="time-options" value="29">29</option>
                                    <option className="time-options" value="30">30</option>
                                    <option className="time-options" value="31">31</option>
                                    <option className="time-options" value="32">32</option>
                                    <option className="time-options" value="44">33</option>
                                    <option className="time-options" value="34">34</option>
                                    <option className="time-options" value="35">35</option>
                                    <option className="time-options" value="36">36</option>
                                    <option className="time-options" value="37">37</option>
                                    <option className="time-options" value="38">38</option>
                                    <option className="time-options" value="39">39</option>
                                    <option className="time-options" value="40">40</option>
                                    <option className="time-options" value="41">41</option>
                                    <option className="time-options" value="42">42</option>
                                    <option className="time-options" value="43">43</option>
                                    <option className="time-options" value="44">44</option>
                                    <option className="time-options" value="45">45</option>
                                    <option className="time-options" value="46">46</option>
                                    <option className="time-options" value="47">47</option>
                                    <option className="time-options" value="48">48</option>
                                    <option className="time-options" value="49">49</option>
                                    <option className="time-options" value="50">50</option>
                                    <option className="time-options" value="51">51</option>
                                    <option className="time-options" value="52">52</option>
                                    <option className="time-options" value="53">53</option>
                                    <option className="time-options" value="54">54</option>
                                    <option className="time-options" value="55">55</option>
                                    <option className="time-options" value="56">56</option>
                                    <option className="time-options" value="57">57</option>
                                    <option className="time-options" value="58">58</option>
                                    <option className="time-options" value="59">59</option>
                                </select>
                                <select className="time" id="am/pm" onChange={(e) => setStartAMPM(e.target.value)}>
                                    <option className="time-options" value="AM">AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select>
                                </label>
                                <label className="label" id="endTime-label">end time:
                                <select className="time" id="time-hour-select" onChange={(e) => setEndHour(e.target.value)}>
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
                                <select className="time" id="time-min-select" onChange={(e) => setEndMin(e.target.value)}>
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
                                    <option className="time-options" value="11">11</option>
                                    <option className="time-options" value="12">12</option>
                                    <option className="time-options" value="13">13</option>
                                    <option className="time-options" value="14">14</option>
                                    <option className="time-options" value="15">15</option>
                                    <option className="time-options" value="16">16</option>
                                    <option className="time-options" value="17">17</option>
                                    <option className="time-options" value="18">18</option>
                                    <option className="time-options" value="19">19</option>
                                    <option className="time-options" value="20">20</option>
                                    <option className="time-options" value="21">21</option>
                                    <option className="time-options" value="22">22</option>
                                    <option className="time-options" value="23">23</option>
                                    <option className="time-options" value="24">24</option>
                                    <option className="time-options" value="25">25</option>
                                    <option className="time-options" value="26">26</option>
                                    <option className="time-options" value="27">27</option>
                                    <option className="time-options" value="28">28</option>
                                    <option className="time-options" value="29">29</option>
                                    <option className="time-options" value="30">30</option>
                                    <option className="time-options" value="31">31</option>
                                    <option className="time-options" value="32">32</option>
                                    <option className="time-options" value="44">33</option>
                                    <option className="time-options" value="34">34</option>
                                    <option className="time-options" value="35">35</option>
                                    <option className="time-options" value="36">36</option>
                                    <option className="time-options" value="37">37</option>
                                    <option className="time-options" value="38">38</option>
                                    <option className="time-options" value="39">39</option>
                                    <option className="time-options" value="40">40</option>
                                    <option className="time-options" value="41">41</option>
                                    <option className="time-options" value="42">42</option>
                                    <option className="time-options" value="43">43</option>
                                    <option className="time-options" value="44">44</option>
                                    <option className="time-options" value="45">45</option>
                                    <option className="time-options" value="46">46</option>
                                    <option className="time-options" value="47">47</option>
                                    <option className="time-options" value="48">48</option>
                                    <option className="time-options" value="49">49</option>
                                    <option className="time-options" value="50">50</option>
                                    <option className="time-options" value="51">51</option>
                                    <option className="time-options" value="52">52</option>
                                    <option className="time-options" value="53">53</option>
                                    <option className="time-options" value="54">54</option>
                                    <option className="time-options" value="55">55</option>
                                    <option className="time-options" value="56">56</option>
                                    <option className="time-options" value="57">57</option>
                                    <option className="time-options" value="58">58</option>
                                    <option className="time-options" value="59">59</option>
                                </select>
                                <select className="time" id="am/pm" onChange={(e) => setEndAMPM(e.target.value)}>
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
                                    >
                                    </input>
                                </label>
                                <button type ="submit" id="submit-btn">Add Event</button>
                            </form>
                        </div>
                    </Popup>
                )} 
            </ReactMapGL>
        </div>

    )
}

export default Map;