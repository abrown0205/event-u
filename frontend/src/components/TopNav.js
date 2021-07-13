import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar, faMap, faBars, faBell, faCog } from "@fortawesome/free-solid-svg-icons"
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
        <div class="topContainer">
            <div class="topBar">
                <div class="linkContainer">
                    <a className="topBarLink" id="homeLink"><FontAwesomeIcon icon={faHome} className="currentIcon"/></a>
                    <a className="topBarLink" id="calendarLink"><FontAwesomeIcon icon={faCalendar} className="topBarIcon"/></a>
                    <a className="topBarLink" id="mapLink" href="/map"><FontAwesomeIcon icon={faMap} className="topBarIcon"/></a>
                    <a className="topBarLink" id="settings"><FontAwesomeIcon icon={faCog} className="topBarIcon"/></a>
                </div>
                <FontAwesomeIcon icon={faBell} className="topBarLink" id="notifications" onClick={openNotif}/>
                <div className={`${isDisplayed ? 'notification-active' : 'notification-box'}`} id="notification">
                </div>
            </div>
        </div>
        
    );
}

export default TopNav;