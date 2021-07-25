import React, { useEffect, useState } from 'react';
import './css/preferences.css';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);

var interestArr;


function ListElements() {
    const [interestState, setInterestState] = useState([]);

    useEffect(() => {
        let interestState = [
            {interest: "Music"},
            {interest: "Studying"},
            {interest: "Arts & Culture"},
            {interest: "Shopping"},
            {interest: "Science"},
            {interest: "Sports"},
        ];

        setInterestState(
            interestState.map(d=> {
                return {
                    select: false,
                    interest: d.interest
                };
            })
        );
    }, []);
    interestArr = interestState;

    return(
        <div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" onChange={e => {
                                let checked = e.target.checked;
                                setInterestState(
                                    interestState.map(d => {
                                        d.select = checked;
                                        return d;
                                    })
                                );
                            }}>
                            </input>
                        </th>
                        <th scope="col" id="interestHeader">Interest</th>
                    </tr>
                </thead>
                <tbody>
                    {interestState.map((d,i) => (
                        <tr key={d.interest}>
                            <th scope="row">
                                <input onChange={event=> {
                                    let checked = event.target.checked;
                                    setInterestState(
                                        interestState.map(data => {
                                            if(d.interest === data.interest) {
                                                data.select = checked;
                                            }
                                            return data;
                                        })
                                    );
                                }}
                                type="checkbox"
                                checked={d.select}
                                ></input>
                            </th>
                            <td>{d.interest}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Options() {
    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 45, opacity: 1},        
    })

    return(
        <animated.div style={props} className="options">
            <ul className ="choiceList">
                <ListElements />
            </ul>
        </animated.div>
    );
};

const HeaderText = ({}) => {
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 70, opacity: 1}
    });
    return <animated.h1 style={props} id="welcomeMessage">Hello {firstName} {lastName}!</animated.h1>
};

const SkipOption = ({}) => {
    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 5, opacity: 1}
    });
    return<animated.h2 style={props} id="skipMessage">Not interested? <a href='/home'>Skip this step.</a></animated.h2>;
}

const HeaderText2 = ({}) => {
    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 75, opacity: 1}
    });
    return<animated.h2 style={props} id="welcomeParagraph">Want to update your preferences? Select some of the following general interests:</animated.h2>;
};

const SubmitButton = ({}) => {
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');
    var uname = ud.username;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const [message,setMessage] = useState('');

    const addPreferences = async event =>
    {
        const interestPayload = [];
        for(var i = 0; i < interestArr.length; i++) {
            if(interestArr[i].select == true) {
                interestPayload.push(interestArr[i].interest);
            }
        }

        event.preventDefault();
        
        var obj = {username:uname,preferences:interestPayload};
        var js = JSON.stringify(obj);
        console.log(js);

        var config =
        {
            method: 'post',
            url: bp.buildPath('api/users/preferences'),
            headers:
            {
                'Content-Type': 'application/json',
            },
            data: js
        }

        axios(config)
            .then(function (response) {
                var res = response.data;
                if(res.error) {
                    setMessage('Unable to submit, try again');
                }
                else {
                    storage.storeToken(res);
                    var jwt = require('jsonwebtoken');
                    
                    var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                    
                    var preferences = ud.payload.preferences;
                    var attendedEvents = ud.payload.attendedEvents;
                    var email = ud.payload.email;
                    var likedEvents = ud.payload.likedEvents;

                    var user = {firstName:firstName,lastName:lastName,preferences:preferences,username:uname,likedEvents:likedEvents,email:email,attendedEvents:attendedEvents};
                    localStorage.setItem('user_data', JSON.stringify(user));
                    window.location.href = '/settings';
                }
            })
            .catch(function (error) {
                console.log(error);
                console.log(message);
            });
    }

    const props = useSpring({
        from: {y: 700, opacity: 0},
        to: {y: 0, opacity: 1}
    });

    return(
        <div id="submitButtonContainer">
            <animated.button style={props} onClick={addPreferences} id="submitSelections">Done</animated.button>
        </div>
    );
};

function UpdatePreferences() {
    //const[on, set] = React.useState(true);
    return(
        <div className="preferencesPage">
            <HeaderText />
            <HeaderText2 />
            <Options />
            <SubmitButton />
            {/* <SkipOption /> */}
            <span></span>
        </div>
    );
};

export default UpdatePreferences;