import './css/home.css';
import { faPlus, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from 'react-spring';

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);

const initialList = [];


// function AddEvent() {
//     // this will redirect you to the page for adding events
//     // window.location.href="http://localhost:3000";
// }


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

    const[isDisplayed, setDisplay] = useState(false)

    const openAdd = () => {
        setDisplay(!isDisplayed);
    }

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
            <div id="postContainer" onClick={openAdd} value={name}>
                <button id="postButton"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="vl"></div>
            <div div className={`${isDisplayed ? 'add-active' : 'addEvent'}`} id="notification">
                <div className="eventPostContainer">
                    <form className="eventForm">
                        <h1 id="eventFormHead">Post a new event!</h1>
                        <input className="eventFormInput" type="text" placeholder="Event Name" /><br />
                        <input className="eventFormInput" type="text" placeholder="Event Location" /><br />
                        <input className="eventFormInput" id="calInput" type="date" placeholder="Event Date" min={new Date()} />
                        <div className="addEventCategories">
                            <button className="eventCatBtn">Music</button>
                            <button className="eventCatBtn">Studying</button>
                            <button className="eventCatBtn">Arts & Culture</button>
                            <button className="eventCatBtn">Shopping</button>
                            <button className="eventCatBtn">Science</button>
                            <button className="eventCatBtn">Sports</button>
                        </div>
                        <div className="separator">
                            <FontAwesomeIcon icon={faCaretDown}/><FontAwesomeIcon icon={faCaretDown}/><FontAwesomeIcon icon={faCaretDown}/>
                        </div>
                        <button id="submitEvent">Submit</button>
                    </form>
                </div>
            </div>
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