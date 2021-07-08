import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar, faMap, faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

const TopNav = () => {

    const[isDisplayed, setDisplay] = useState(false)

    const openNotif = () => {
        // alert('Works!')
        setDisplay(!isDisplayed)
    }

    const onClickMap = () => {
        window.location.href="/map";
    }

    return(
        <div class="topBar">
            <div class="linkContainer">
                <a className="topBarLink" id="homeLink"><FontAwesomeIcon icon={faHome} className="currentIcon"/></a>
                <a className="topBarLink" id="calendarLink"><FontAwesomeIcon icon={faCalendar} className="topBarIcon"/></a>
                <a className="topBarLink" id="mapLink" href="/map"><FontAwesomeIcon icon={faMap} className="topBarIcon"/></a>
            </div>
            <FontAwesomeIcon icon={faBars} className="topBarLink" id="fabars" onClick={openNotif}/>
            <div className={`${isDisplayed ? 'notification-active' : 'notification-box'}`} id="notification">
                <p>Notifications go here</p>
                <p>Notifications go here</p>
                <p>Notifications go here</p>
                <p>Notifications go here</p>
                <p>Notifications go here</p>
                <p>Notifications go here</p>
                <p>Notifications go here</p>

            </div>
        </div>
    );
}

export default TopNav;