import './css/home.css';
import { faPlus, faTimesCircle, faRunning, faFlask, faUserGraduate, faPalette, faGuitar, faShoppingBag, faSearch, faHeart, faSync } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    format,
    parseISO,
    isDate,
    isExists
  } from "date-fns";
import useOnclickOutside from "react-cool-onclickoutside";


var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);

const initialList = [];


// function AddEvent() {
//     // this will redirect you to the page for adding events
//     // window.location.href="http://localhost:3000";
// }

//globals
var Month = format(new Date(), "MM");
var Day = "01";
var Year= format(new Date(), "yyyy");
var StartHour = "12";
var StartMin = "00";
var EndHour = "12";
var EndMin = "00";

var Title = "unset";
var Lat;
var Long;
var Description;
var Capacity;
var EditID;
var Category;
var Address;
var CreatedBy;





export default function EditForm(props) {
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');
    var testArr = [];

    const [name, setName] = useState('');

    const [contentStatus, displayContent] = React.useState(true);
    

    const contentProps = useSpring({
        opacity: contentStatus ? 1 : 0,
        marginTop: contentStatus ? 295 : -1000
    })

    const [editStatus, displayEdit] = React.useState(false);
    const editProps = useSpring ({
        opacity: editStatus ? 1 : 0,
        marginTop: editStatus ? -250 : -1000
    })

    //Load Props into Globals
    Title = props.event.title;
    Description = props.event.description;
    Category = props.event.category;
    Lat = props.event.lat;
    Long = props.event.long;
    Month = format(parseISO(props.event.startTime), "MM");
    Day = format(parseISO(props.event.startTime), "dd");
    Year = format(parseISO(props.event.startTime), "yyyy");
    Address = props.event.address;
    StartHour = format(parseISO(props.event.startTime), "HH");
    StartMin = format(parseISO(props.event.startTime), "mm");
    EndHour = format(parseISO(props.event.endTime), "HH");
    EndMin = format(parseISO(props.event.endTime), "mm");
    Capacity = props.event.capacity;
    EditID = props.event._id;
    CreatedBy = props.event.createdBy;
    console.log(EditID);


    var createdBy = ud.username;
    const [eventToDelete, setEventToDelete] = useState('');
    const [values, setValues] = useState([]);
    const [events, setEvents] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(Title);
    const [lat, setLat] = useState(Lat);
    const [long, setLong] = useState(Long);
    const [category, setCategory] = useState(Category);
    const [address, setAddress] = useState(Address);
    const [startHour, setStartHour] = useState(StartHour);
    const [startMin, setStartMin] = useState(StartMin);
    const [startAMPM, setStartAMPM] = useState('AM');
    const [startTime, setStartTime] = useState(null);
    const [endHour, setEndHour] = useState(EndHour);
    const [endMin, setEndMin] = useState(EndMin);
    const [endAMPM, setEndAMPM] = useState('AM');
    const [endTime, setEndTime] = useState(null);
    const [description, setDescription] = useState(Description);
    const [likes, setLikes] = useState(0);
    const [capacity, setCapacity] = useState(Capacity);
    const [eventMsg, setEventMsg] = useState("");
    const [currentId, setCurrentId] = useState();
    const[year, setYear] = useState(Year);
    const[month, setMonth] = useState(Month);
    const[day, setDay] = useState(Day);

    


    

 
 
    
 



    
    const handleEventUpdate = async (e) => {
        const startTimeString = year + "-" + month + "-" + day + "T" + startHour + ":" + startMin;
        const endTimeString = year + "-" + month + "-" + day + "T" + endHour + ":" + endMin;
      

        var startTime = startTimeString;
        var endTime = endTimeString;

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
        
        const event = EditID;
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

        console.log("we made it to generating the event");
        console.log(obj);
        console.log(editPayload);
        console.log("editID: " + EditID);

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
        <div >
            
            


            <animated.div className="addEvent" style={contentProps}>
                <div className="eventPostContainer">
                    <div>
                        <div id="closeForm" onClick={() => displayContent(a => !a)}><FontAwesomeIcon icon={faTimesCircle} /></div>
                        <form className="eventForm" onSubmit={handleEventUpdate} autoComplete="off">
                            <h4 className="form-header">Edit Your Event!</h4>
                            <label className="label" id="name-label">title:
                                <input
                                    type="text"
                                    className="input-field"
                                    id="name-input"
                                    placeholder="Enter title..."
                                    defaultValue = {Title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                            <label className="label" id="cat-label">category:
                                <select id="options-list" defaultValue={Category} onChange={(e) => setCategory(e.target.value)}>
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
                                    defaultValue = {Address}
                                    onChange={handleAddressInput}
                                    />
                                    {status === "OK" && <ul className="addressUl">{renderSuggestions()}</ul>}
                                </div>
                            </label>

                            <label className="label" id="desc-label">Date:
                                <select className="time" id="date-month-select" defaultValue={Month} onChange={(e) => setMonth(e.target.value)}>
                                    <option className="date-options" value="01">January</option>
                                    <option className="date-options" value="02">February</option>
                                    <option className="date-options" value="03">March</option>
                                    <option className="date-options" value="04">April</option>
                                    <option className="date-options" value="05">May</option>
                                    <option className="date-options" value="06">June</option>
                                    <option className="date-options" value="07">July</option>
                                    <option className="date-options" value="08">August</option>
                                    <option className="date-options" value="09">September</option>
                                    <option className="date-options" value="10">October</option>
                                    <option className="date-options" value="11">November</option>
                                    <option className="date-options" value="12">December</option>
                                </select>
                                <select className="time" id="date-month-select" defaultValue={Day} onChange={(e) => setDay(e.target.value)}>
                                    <option className="date-options" value="01">01</option>
                                    <option className="date-options" value="02">02</option>
                                    <option className="date-options" value="03">03</option>
                                    <option className="date-options" value="04">04</option>
                                    <option className="date-options" value="05">05</option>
                                    <option className="date-options" value="06">06</option>
                                    <option className="date-options" value="07">07</option>
                                    <option className="date-options" value="08">08</option>
                                    <option className="date-options" value="09">09</option>
                                    <option className="date-options" value="10">10</option>
                                    <option className="date-options" value="11">11</option>
                                    <option className="date-options" value="12">12</option>
                                    <option className="date-options" value="13">13</option>
                                    <option className="date-options" value="14">14</option>
                                    <option className="date-options" value="15">15</option>
                                    <option className="date-options" value="16">16</option>
                                    <option className="date-options" value="17">17</option>
                                    <option className="date-options" value="18">18</option>
                                    <option className="date-options" value="19">19</option>
                                    <option className="date-options" value="20">20</option>
                                    <option className="date-options" value="21">21</option>
                                    <option className="date-options" value="22">22</option>
                                    <option className="date-options" value="23">23</option>
                                    <option className="date-options" value="24">24</option>
                                    <option className="date-options" value="25">25</option>
                                    <option className="date-options" value="26">26</option>
                                    <option className="date-options" value="27">27</option>
                                    <option className="date-options" value="28">28</option>
                                    <option className="date-options" value="29">29</option>
                                    <option className="date-options" value="30">30</option>
                                    <option className="date-options" value="31">31</option>
                                </select>
                                <select className="time" id="date-month-select" defaultValue={Year} onChange={(e) => setYear(e.target.value)}>
                                    <option className="date-options" value="2021">2021</option>
                                    <option className="date-options" value="2022">2022</option>
                                    <option className="date-options" value="2023">2023</option>
                                    <option className="date-options" value="2024">2024</option>
                                    <option className="date-options" value="2025">2025</option>
                                    <option className="date-options" value="2026">2026</option>   
                                    <option className="date-options" value="2027">2027</option>   
                                    <option className="date-options" value="2028">2028</option>   
                                    <option className="date-options" value="2029">2029</option>   
                                    <option className="date-options" value="2030">2030</option>                         
                                </select>
                            </label>

                            
                            
                            <label className="label" id="startTime-label">start time:
                                <select className="time" defaultValue={StartHour} id="time-hour-select"  onChange={(e) => setStartHour(e.target.value)}>
                                    <option className="time-options" value="00">12 AM</option>
                                    <option className="time-options" value="01">1 AM</option>
                                    <option className="time-options" value="02">2 AM</option>
                                    <option className="time-options" value="03">3 AM</option>
                                    <option className="time-options" value="04">4 AM</option>
                                    <option className="time-options" value="05">5 AM</option>
                                    <option className="time-options" value="06">6 AM</option>
                                    <option className="time-options" value="07">7 AM</option>
                                    <option className="time-options" value="08">8 AM</option>
                                    <option className="time-options" value="09">9 AM</option>
                                    <option className="time-options" value="10">10 AM</option>
                                    <option className="time-options" value="11">11 AM</option>
                                    <option className="time-options" value="12">12 PM</option>
                                    <option className="time-options" value="13">1 PM</option>
                                    <option className="time-options" value="14">2 PM</option>
                                    <option className="time-options" value="15">3 PM</option>
                                    <option className="time-options" value="16">4 PM</option>
                                    <option className="time-options" value="17">5 PM</option>
                                    <option className="time-options" value="18">6 PM</option>
                                    <option className="time-options" value="19">7 PM</option>
                                    <option className="time-options" value="20">8 PM</option>
                                    <option className="time-options" value="21">9 PM</option>
                                    <option className="time-options" value="22">10 PM</option>
                                    <option className="time-options" value="23">11 PM</option>                                  
                                    
                                </select>
                                <select className="time" id="time-min-select" defaultValue={StartMin} onChange={(e) => setStartMin(e.target.value)}>
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
                                    <option className="time-options" value="33">33</option>
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
                                {/* <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setStartAMPM(e.target.value)}>
                                    <option className="time-options" value="AM">AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select> */}
                            </label>
                            <label className="label" id="endTime-label">end time:
                                <select className="time" id="time-hour-select" defaultValue={EndHour} onChange={(e) => setEndHour(e.target.value)}>
                                <option className="time-options" value="00">12 AM</option>
                                    <option className="time-options" value="01">1 AM</option>
                                    <option className="time-options" value="02">2 AM</option>
                                    <option className="time-options" value="03">3 AM</option>
                                    <option className="time-options" value="04">4 AM</option>
                                    <option className="time-options" value="05">5 AM</option>
                                    <option className="time-options" value="06">6 AM</option>
                                    <option className="time-options" value="07">7 AM</option>
                                    <option className="time-options" value="08">8 AM</option>
                                    <option className="time-options" value="09">9 AM</option>
                                    <option className="time-options" value="10">10 AM</option>
                                    <option className="time-options" value="11">11 AM</option>
                                    <option className="time-options" value="12">12 PM</option>
                                    <option className="time-options" value="13">1 PM</option>
                                    <option className="time-options" value="14">2 PM</option>
                                    <option className="time-options" value="15">3 PM</option>
                                    <option className="time-options" value="16">4 PM</option>
                                    <option className="time-options" value="17">5 PM</option>
                                    <option className="time-options" value="18">6 PM</option>
                                    <option className="time-options" value="19">7 PM</option>
                                    <option className="time-options" value="20">8 PM</option>
                                    <option className="time-options" value="21">9 PM</option>
                                    <option className="time-options" value="22">10 PM</option>
                                    <option className="time-options" value="23">11 PM</option>  
                                </select>
                                <select className="time" id="time-min-select" defaultValue={EndMin} onChange={(e) => setEndMin(e.target.value)}>
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
                                    <option className="time-options" value="33">33</option>
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
                                {/* <select className="time" id="am/pm" defaultValue="AM" onChange={(e) => setEndAMPM(e.target.value)}>
                                    <option className="time-options" value="AM">AM</option>
                                    <option className="time-options" value="PM">PM</option>
                                </select> */}
                            </label>                          

                            <label className="label" id="desc-label" >description:</label>
                            <textarea
                                id="comment-box"
                                placeholder="Comments..."
                                defaultValue = {Description}
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
                                    defaultValue={Capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                />
                            </label>
                            <div className="submitContainer">
                                <button type ="submit" id="submitEvent">Edit Event</button>
                            </div>
                            <span className="eventError">{eventMsg}</span>
                        </form>
                    </div>
                </div>
            </animated.div>

        </div>
    );
};