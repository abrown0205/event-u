import { faHome } from "@fortawesome/free-solid-svg-icons"
import { faCalendar, faMap, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);



const TopNav = () => {
    var currentUrl = window.location.pathname;
    var firstName = ud.firstName;
    var lastName = ud.lastName;
    var username = ud.username;
    var preferences = ud.preferences;

    function setColorHome() {
        if(currentUrl === '/home') return 'homeActive';
    }
    function setColorCalender() {
        if(currentUrl === '/calendar') return 'calendarActive';
    }
    function setColorMap() {
        if(currentUrl === '/map') return 'mapActive';
    }
    

    const[isDisplayed, setDisplay] = useState(false)

    const openNotif = () => {
        // alert('Works!')
        setDisplay(!isDisplayed);
    }

    const onClickHome = () => {
        window.location.href="/home";
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
                    <a className="topBarLink" id={setColorHome()} onClick={onClickHome}><FontAwesomeIcon icon={faHome} className="topBarIcon"/></a>
                    <a className="topBarLink" id={setColorCalender()} onClick={onClickCalender}><FontAwesomeIcon icon={faCalendar} className="topBarIcon"/></a>
                    <a className="topBarLink" id={setColorMap()} onClick={onClickMap}><FontAwesomeIcon icon={faMap} className="topBarIcon"/></a>
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