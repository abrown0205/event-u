import React, { useState, Component } from 'react';
import './css/login.css';


function Inputs() {
    var bp = require('./Path.js');

    var createName;
    var createPassword;
    var lname;
    var fname;
    var email;

    const [message,setMessage] = useState('');

    const doSignUp = async event =>
    {
        event.preventDefault();


        var obj = {username:createName.value,firstName:fname.value,lastName:lname.value,password:createPassword.value,email:email.value};
        console.log(obj);
        var js = JSON.stringify(obj);
        var url = bp.buildPath('api/users/register');
        try
        {
            const response = await fetch(url, 
                {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
                
            var res = JSON.parse(await response.text());

            if(res.id <= 0)
            {
                setMessage('Failed to create new account');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName};
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/home';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
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
