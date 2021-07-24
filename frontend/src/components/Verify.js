import React, { useState } from 'react';
import './css/login.css';
import './css/verify.css'
import axios from 'axios';

function Verify()
{   
    var bp = require('./Path.js');
    var storage = require('../tokenStorage');
    
    const [message, setMessage] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var fname = ud.firstName;
    var lname = ud.lastName;

    const sendVerification = async event =>
    {
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
                    setMessage('Email resent!');
                })
        }
        catch(e)
        {
            console.log(e);
        }
    }
    
    const doVerify = async event => {
        event.preventDefault();
        var trueCode = ud.activationCode;
        var x = parseInt(verifyCode);
        if(x === trueCode) {
            var obj = {username:ud.username, active:true};
            var js = JSON.stringify(obj);

            var config =
            {
                method: 'post',
                url: bp.buildPath('api/users/activate'),
                headers:
                {
                    'Content-Type': 'application/json',
                },
                data: js
            };

            axios(config)
                .then(function(response) {
                    var res=response.data;
                    if(res.error) {
                        setMessage('Verification Code Incorrect');
                    }
                    else
                    {
                        storage.storeToken(res);
                        var jwt = require('jsonwebtoken');

                        var ud = jwt.decode(storage.retrieveToken(), {complete:true});
                        var firstName = ud.payload.firstName;
                        var lastName = ud.payload.lastName;
                        var username = ud.payload.username;
                        var preferences = ud.payload.preferences;
                        var likedEvents = ud.payload.likedEvents;
                        var email = ud.payload.email;
                        var attendedEvents = ud.payload.attendedEvents;
                        var userId = ud.payload._id;
                        var active = ud.payload.active;

                        var user = {firstName:firstName,lastName:lastName,username:username,preferences:preferences,_id:userId,attendedEvents:attendedEvents,email:email,likedEvents:likedEvents,active:active};
                        localStorage.setItem('user_data', JSON.stringify(user));
                        window.location.href = '/preferences';
                    }
                })
        }
        else {
            setMessage('Verification Code Incorrect');
        }
    };

    return(
        <div className="verifyDiv">
            <div className="verifyContainer">
                <div className="verifyForm">
                    <h1 id="verifyHeader">Hello, {fname} {lname}!</h1>
                    <h2 id="verifySubheader">Enter your verification code found in your email below:</h2>
                    <form className="submitVerification" onSubmit={doVerify}>
                        <input className="verifyInput" type="text" value={verifyCode} onChange={e => setVerifyCode(e.target.value)} placeholder="Verification Code" /><br />
                        <button type="submit" id="submitVerify">Verify</button>
                    </form>
                    <br />
                    <span id="errMsg">{message}</span>
                    <h3 id="lostMsg">Can't find your code? <a id="codeClick" onClick={sendVerification}>Click here to resend it!</a></h3>
                </div>
            </div>
        </div>
    );
};

export default Verify;
