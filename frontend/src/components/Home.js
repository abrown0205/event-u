// import React, { useState } from 'react'
import './css/home.css'

import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-solid-svg-icons"
import { faPlus, faMap, faBars, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useState } from 'react'
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

    function AddEvent() {
        // this will redirect you to the page for adding events
        // window.location.href="http://localhost:3000";
        const newList = list.concat(name);
        setList(newList);

    }

    return(
        <div className="myEvents">
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