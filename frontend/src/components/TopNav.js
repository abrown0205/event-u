import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar, faMap, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);



const TopNav = () => {

    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var username = ud.username;
    var preferences = ud.preferences;

    const[isDisplayed, setDisplay] = useState(false)

    const openNotif = () => {
        // alert('Works!')
        setDisplay(!isDisplayed);
    }

    const onClickMap = () => {
        window.location.href="/map";
    }

    const onClickCalender = () => {
        window.location.href = "/calendar";
    }

    function doLogout() {
        localStorage.clear();
        window.location.href = "/";
    }

    return(
        <div className="topContainer">
            <div className="topBar">
                <div className="linkContainer">
                    <a className="topBarLink" id="homeLink"><FontAwesomeIcon icon={faHome} className="currentIcon"/></a>
                    <a className="topBarLink" id="calendarLink"><FontAwesomeIcon icon={faCalendar} className="topBarIcon"/></a>
                    <a className="topBarLink" id="mapLink" href="/map"><FontAwesomeIcon icon={faMap} className="topBarIcon"/></a>
                </div>
                <FontAwesomeIcon icon={faUser} className="topBarLink" id="notifications" onClick={openNotif}/>
                
                <div className={`${isDisplayed ? 'notification-active' : 'notification-box'}`} id="notification">
                    <div className="userBtnContainer">
                        <h1 id="userBarHead">Welcome back {firstName} {lastName}!</h1>
                        <br />
                        <button className="userBtns" id="logoutBtn" onClick={doLogout}>Logout</button>
                        <button className="userBtns" id="settingsBtn">Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNav;