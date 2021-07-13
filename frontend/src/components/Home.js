// import React, { useState } from 'react'
import './css/home.css'

import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { faPlus, faMap, faBars, faSearch, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import React, { useState } from 'react'
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);

const initialList = [];


// function AddEvent() {
//     // this will redirect you to the page for adding events
//     // window.location.href="http://localhost:3000";
// }

function DisplayAdd() {
    return(
        <div className="addEvent">
            <form className="eventForm">
                <h1 id="eventFormHead">Post a new event!</h1>
                <input className="eventFormInput" type="text" placeholder="Event Name" /><br />
                <input className="eventFormInput" type="text" placeholder="Event Location" /><br />
                <input  className="eventFormInput" id="calInput" type="date" placeholder="Event Date" min={new Date()} />
                <div className="addEventCategories">
                    <button className="eventCatBtn">Music</button>
                    <button className="eventCatBtn">Outdoor Activities</button>
                    <button className="eventCatBtn">Games</button>
                    <button className="eventCatBtn">Shopping</button>
                    <button className="eventCatBtn">Movies</button>
                    <button className="eventCatBtn">Sports</button>
                    <button className="eventCatBtn">Food and Drink</button>
                </div>
                <div className="separator">
                    <FontAwesomeIcon icon={faCaretDown}/><FontAwesomeIcon icon={faCaretDown}/><FontAwesomeIcon icon={faCaretDown}/>
                </div>
                <button id="submitEvent">Submit</button>
            </form>
        </div>
    );
}

function Event(item) {
    return(
        <li className="eventItem" id={item.id} >
            {item.name}
        </li>
    );
}

function Events() {
    const [list, setList] = useState(initialList)
    const [name, setName] = useState('')

    function AddEvent() {
        
        // this will redirect you to the page for adding events
        // window.location.href="http://localhost:3000";
        const newList = list.concat(name);
        setList(newList);

    }

    return(
        <div className="myEvents">
            <br /><br /><br />
            <h1 id="eventsHeader">My Events</h1>
            <div id="postContainer" onClick={AddEvent} value={name}>
                <button id="postButton"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="vl"></div>
            <div className="eventHolder">
                <ul className="eventList">
                    {list.map((item) =>(
                        <Event item={item}/>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function OngoingEvents() {
    return (
        <div id="ongoing-Events">
            <ul className="ongoing-List">
                <Event />
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
            <TopNav />
            <Events />
            <div className="nearbyEvents">
                <h1 id="ongoing">Events Near U</h1>
                <OngoingEvents />
                <Search />
            </div>
            <DisplayAdd />
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