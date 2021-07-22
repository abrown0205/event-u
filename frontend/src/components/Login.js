import React, { useState } from 'react';
import './css/login.css';
import axios from 'axios';

function Login()
{
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var loginName;
    var loginPassword;

    const [message,setMessage] = useState('');

    const doLogin = async event =>
    {
        event.preventDefault();


        var obj = {username:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

        var config =
        {
            method: 'post',
            url: bp.buildPath('api/users/login'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        try {
            axios(config)
            .then(function (response) {
                var res = response.data;
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

                    var user = {firstName:firstName,lastName:lastName,username:username,preferences:preferences,_id:userId,attendedEvents:attendedEvents,email:email,likedEvents:likedEvents};
                    localStorage.setItem('user_data', JSON.stringify(user));
                    window.location.href = '/home';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        catch(e) {
            console.log(e);
        };
    };

    return(
        <div className="LoginPage">
            <div className="loginDiv">
                <h1 id="title">Welcome Back!</h1>
                <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} /> <br />
                <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c}/><br />
                <input type="submit" id="loginButton" value="Sign In" onClick={doLogin} />
                <h3 id="forgotPass">Forgot Password? <a id="forgotBtn">Click here</a></h3>
                <span id="loginResult">{message}</span>
                <h3 id="redirectText">Don't have an account?<a href="/signup" id="redirectButton"> Sign Up!</a></h3>
            </div>
        </div>
    );
};

export default Login;
