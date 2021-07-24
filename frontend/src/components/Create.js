import React, { useState, Component } from 'react';
import './css/login.css';
import axios from 'axios';

function Inputs() {
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var createName;
    var createPassword;
    var lname;
    var fname;
    var email;

    const [message,setMessage] = useState('');

    const sendVerification = async event =>
    {
        var _ud = localStorage.getItem('user_data');
        var ud = JSON.parse(_ud);

        console.log(ud);

        var obj = {username:ud.username,firstName:ud.firstName,lastName:ud.lastName,email:ud.email,activationCode:ud.activationCode};
        var js = JSON.stringify(obj);
        var config =
        {
            method: 'post',
            url: bp.buildPath('api/users/sendWelcomeEmail'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        try {
            const result = await axios(config)
                .then(function (response) {
                    var res = response.data;
                    if(res.error)
                    {
                        setMessage('Username or email is invalid');
                    }
                    else
                    {
                        window.location.href = '/verify';
                    }
                })
        }
        catch(e)
        {
            console.log(e);
        }
    }

    const doSignUp = async event =>
    {
        event.preventDefault();


        var obj = {username:createName.value,firstName:fname.value,lastName:lname.value,password:createPassword.value,email:email.value};
        var js = JSON.stringify(obj);
        var config =
        {
            method: 'post',
            url: bp.buildPath('api/users/register'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }
        await axios(config)
        .then(function(response) {
            var res = response.data;
        
            console.log(res);
            storage.storeToken(res);
            var jwt = require('jsonwebtoken');
            var ud = jwt.decode(storage.retrieveToken(),{complete:true});
            console.log(ud);
            var firstName = ud.payload.firstName;
            var lastName = ud.payload.lastName;
            var username = ud.payload.username;
            var preferences = ud.payload.preferences;
            var likedEvents = ud.payload.likedEvents;
            var email = ud.payload.email;
            var attendedEvents = ud.payload.attendedEvents;
            var userId = ud.payload._id;
            var active = ud.payload.active;
            var activationCode = ud.payload.activationCode;

            var user = {firstName:firstName,lastName:lastName,username:username,preferences:preferences,_id:userId,attendedEvents:attendedEvents,email:email,likedEvents:likedEvents,active:active, activationCode:activationCode};
            console.log(user);
            localStorage.setItem('user_data', JSON.stringify(user));

            setMessage('');

            sendVerification();
        }).catch(function(error) {
            console.log(error)
        });
    };

    return(
        <div className="createDiv">
            <h1 id="title">Welcome to EventU!</h1>
            <input type="text" id="fname" placeholder="First Name" ref={(c) => fname = c}></input> <br />
            <input type="text" id="lname" placeholder="Last Name" ref={(c) => lname = c}></input> <br />
            <input type="text" id="email" placeholder="Email" ref={(c) => email = c}></input> <br />
            <input type="text" id="createName" placeholder="Username" ref={(c) => createName = c}></input> <br />
            <input type="password" id="createPassword" placeholder="Password" ref={(c) => createPassword = c}></input><br />
            <input type="submit" id="loginButton" value="Sign Up" onClick={doSignUp}></input>
            <h3 id="redirectText">Already have an account?<a href="/login" id="redirectButton"> Sign In!</a></h3>
        </div>
    );
}

function Create()
{
    return(
        <div className="LoginPage">
            <Inputs />
        </div>
    );
};

export default Create;
