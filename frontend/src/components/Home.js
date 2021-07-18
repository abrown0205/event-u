import './css/home.css';
import { faPlus, faTimesCircle, faRunning, faFlask, faUserGraduate, faPalette, faGuitar, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
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

    const [list, setList] = useState(initialList)
    const [name, setName] = useState('')

    const [contentStatus, displayContent] = React.useState(false);

    var createdBy = ud.username;
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

    const contentProps = useSpring({
        opacity: contentStatus ? 1 : 0,
        marginTop: contentStatus ? 295 : -1000
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStartTime(startHour + ":" + startMin + " " + startAMPM);
        setEndTime(endHour + ":" + endMin + " " + endAMPM);
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
            setNewPlace(null);
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

    return(
        <div className="myEvents">
            <br /><br /><br />
            <h1 id="eventsHeader">My Events</h1>
            <div id="postContainer" onClick={() => displayContent(a => !a)} value={name}>
                <button id="postButton"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="vl"></div>
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
                                <select id="options-list" defaultValue="arts & culture" onChange={(e) => setCategory(e.target.value)}>
                                    <option id="cat-options" value="arts & culture">Arts & Culture</option>
                                    <option id="cat-options" value="sports">Sports</option>
                                    <option id="cat-options" value="science">Science</option>
                                    <option id="cat-options" value="music">Music</option>
                                    <option id="cat-options" value="shopping">Shopping</option>
                                    <option id="cat-options" value="studying">Studying</option>
                                </select>
                            </label>
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
                        </form>
                    </div>
                </div>
            </animated.div>
            <div className="eventHolder">
                <ul className="eventList">
                    
                </ul>
            </div>
        </div>
    );
}

function OngoingEvents() {
    var preferences = [];
    for(var i = 0; i < ud.preferences.length; i++) {
        preferences.push(ud.preferences[i]);
    }
    
    console.log(preferences);
    const listCategories = preferences.map((preference) => {
        <li key="element">{preference}</li>
    });

    /*const addCategories = () => {
        var preferenceIcon;
        
        if(preferenceName === 'sports')
            preferenceIcon = faRunning;
        else if(preferenceName === 'science')
            preferenceIcon = faFlask;
        else if(preferenceName === 'studying')
            preferenceIcon = faUserGraduate;
        else if(preferenceName === 'arts & culture')
            preferenceIcon = faPalette;
        else if(preferenceName === 'music')
            preferenceIcon = faGuitar;
        else if(preferenceName === 'shopping')
            preferenceIcon = faShoppingBag;
        return(
            <li className="eventItem" id={preferenceName} >
                <div className="iconContainer">
                    <FontAwesomeIcon className="categoryIcon" icon={preferenceIcon} />
                </div>
            </li>
        );
    }*/
    
    return (
        <div id="ongoing-Events">
            <ul className="ongoing-List">
                {listCategories}
            </ul>
        </div>
    );
}

function Search() {
    return(
        <div className="searchContainer">
            <input type="text" placeholder="Find an Event" id="searchInput" />
        </div>
    );
}

function HomePage() {
    return(
        <div>
            <div className="background">
                <div className="blur"></div>
            </div>
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
            <HomePage />
        </div>
    );
};

export default Home;