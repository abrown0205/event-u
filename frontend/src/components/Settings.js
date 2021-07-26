import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/settings.css';

var bp = require('./Path.js');

function Settings() {

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var storage = require('../tokenStorage.js');
    const [passOption, setPassOption] = useState(false);
    const [firstName, setFirstName] = useState(ud.firstName);
    const [lastName, setLastName] = useState(ud.lastName);
    const [username, setUserName] = useState(ud.username);
    const [password, setPassword] = useState();
    const [email, setEmail] = useState(ud.email);
    const [displayed, setDisplayed] = useState(false);
    const [message, setMessage] = useState('');
    const changePassword = (e, bool) => {
        e.preventDefault();
        setPassOption(bool);
        setDisplayed(bool);
    }
    
    const onClickUpdatePref = (e) => {
        e.preventDefault();
        window.location.href="/updatePreferences";
        
    }

    const onClickCancel = (e) => {
        e.preventDefault();
        window.location.href="/home";
    }

    const changeSettings = async (e) => {
        e.preventDefault();
        
        const id = ud._id;
        console.log("id: " + id);
        const updatedUser = {
            firstName,
            lastName,
            email,
            username,
            password,
        }
        console.log(updatedUser);

        const update = {
            _id: id,
            profile: updatedUser,
        }
        console.log(update);

        try {
            const url = bp.buildPath("api/users/editUser");
            await axios.post(url, update).then(function(response) {
                var res = response.data;
                storage.storeToken(res);
                var jwt = require('jsonwebtoken');
                var ud = jwt.decode(storage.retrieveToken(),{complete:true});

                if(res.error) {
                    setMessage('User/Password combination incorrect');
                }
                else {
                    storage.storeToken(res);
                    var jwt = require('jsonwebtoken');

                    var ud = jwt.decode(storage.retrieveToken(),{complete:true});

                    var firstName = ud.payload.firstName;
                    var lastName = ud.payload.lastName;
                    var username = ud.payload.username;
                    var preferences = ud.payload.preferences;
                    var likedEvents = ud.payload.likedEvents;
                    var email = ud.payload.email;
                    var attendedEvents = ud.payload.attendedEvents;
                    var userId = ud.payload._id;
                    var active = ud.payload.active;
                    console.log(likedEvents);
                    var user = {firstName:firstName,lastName:lastName,username:username,preferences:preferences,_id:userId,attendedEvents:attendedEvents,email:email,likedEvents:likedEvents,active:active};
                    localStorage.setItem('user_data', JSON.stringify(user));
                }
            });
            console.log("User successfully updated");
            window.location.href="/home";
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="settings">
            <div className="settings-form">
                <h2 id="title">Edit Form</h2>
                <form>
                    <label className="input-label">First Name
                        <input 
                            type="text"
                            placeholder="Change first name"
                            className="input-field"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                    <label className="input-label">Last Name
                        <input 
                            type="text"
                            placeholder="Change last name"
                            className="input-field"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>
                    <label className="input-label">Email
                        <input 
                            type="text"
                            placeholder="Change email"
                            className="input-field"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label className="input-label">Username
                        <input 
                            type="text"
                            placeholder="Change username"
                            className="input-field"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </label>
                    <label className="input-label">Password
                        <input 
                            type="text"
                            placeholder="Change password"
                            className="input-field"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button className="settings-btn" id="set-preferences" onClick={onClickUpdatePref}>preferences</button>
                    <button className="settings-btn" id="set-cancel" onClick={onClickCancel}>Cancel</button>
                    <button className="settings-btn" id="set-save" onClick={(e) => changeSettings(e)}>Save</button>
                </form>
            </div>
        </div>
    )
}

export default Settings;
