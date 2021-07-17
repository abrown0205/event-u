import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { useState, useEffect } from 'react';
import "../components/css/map.css";
import { AirportShuttle, Room, Star } from '@material-ui/icons'
import axios from 'axios';
// import { format } from "timeago.js";

var bp = require('./Path.js');



function Map() {
    const createdBy = "erondon";
    const [values, setValues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
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
    const [viewPort, setViewPort] = useState({
        latitude: 28.60236,
        longitude: -81.20008,
        // width: '100vw',
        // height: '100vh',
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 14
    });

    // gets all the events from the database and displays them on the map
    useEffect(() => {
        const getEvents = async () => {
            try{
                const url = bp.buildPath("api/events/findevent");

                const res = await axios.get(url);
                console.log(res.data);
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
        console.log("Start time: " + startTime);
        console.log("End time: " + endTime);
        console.log("Category:" + category);
        console.log("Hour:" + startHour);
        console.log("Min:" + startMin);
        console.log("AM/PM: " + startAMPM);
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

    const onLike = async (e) => {

    }

    return (
        <div className="map">
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
                                color: "red",
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
                        <div className="addEvent-form">
                            <h4 className="form-header">{events.category} Event!</h4>
                            <p>title: {events.title}</p>
                            <p>description: {events.description}</p>
                            <p>capacity: {events.capacity}</p>
                            <p>address: {events.address}</p>
                            <p>startTime: {events.startTime}</p>
                            <p>endTime: {events.endTime}</p>
                            <p>createdBy: {events.createdBy}</p>
                            {/* Use the useState above for likes to update the 
                                amount of likes a post has and update the database
                                accordingly */}
                            <p>likes: {events.capacity}</p>
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
                                    <option id="cat-options" value="Arts/Culture" selected>Arts & Culture</option>
                                    <option id="cat-options" value="Sports">Sports</option>
                                    <option id="cat-options" value="Hangout">Hangout</option>
                                    <option id="cat-options" value="Music">Music</option>
                                </select>
                                </label>
                                <label className="label" id="add-label">address:
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    id="add-input" 
                                    placeholder="Enter address..."
                                    onChange={(e) => setAddress(e.target.value)}
                                    ></input>
                                </label>
                                <label className="label" id="startTime-label">start time:
                                <select className="time" id="time-hour-select" onChange={(e) => setStartHour(e.target.value)}>
                                    <option className="time-options" value="12" selected>12</option>
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
                                    <option className="time-options" value="00" selected>00</option>
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
                                <select className="time" id="am/pm" onChange={(e) => setStartAMPM(e.target.value)}>
                                    <option className="time-options" value="AM" selected>AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select>
                                </label>
                                <label className="label" id="endTime-label">end time:
                                <select className="time" id="time-hour-select" onChange={(e) => setEndHour(e.target.value)}>
                                    <option className="time-options" value="12" selected>12</option>
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
                                    <option className="time-options" value="00" selected>00</option>
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
                                <select className="time" id="am/pm" onChange={(e) => setEndAMPM(e.target.value)}>
                                    <option className="time-options" value="AM" selected>AM</option>
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