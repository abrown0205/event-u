import React, { useEffect, useState } from 'react';
import './css/preferences.css';
import { useSpring, animated } from 'react-spring';

var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);
//var firstName = ud.firstName;
//var lastName = ud.lastName;

var firstName = "martin";
var lastName = "mccarthy";

var totalSelected = 0;

function ListElements() {

    const [interestState, setInterestState] = useState([]);

    useEffect(() => {
        let interestState = [
            {interest: "Music"},
            {interest: "Hiking"},
            {interest: "Biking"},
            {interest: "Video Games"},
            {interest: "Coffee"},
            {interest: "Board Games"},
            {interest: "Beach"},
            {interest: "Shopping"},
            {interest: "Movies"},
            {interest: "Partying"},
            {interest: "Sports"},
            {interest: "Food and Drink"}
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
                                        totalSelected = 12;
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
                                                totalSelected++;
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
        to: {y: 50, opacity: 1},        
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
    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 70, opacity: 1}
    });
    return <animated.h1 style={props} id="welcomeMessage">Welcome {firstName} {lastName}!</animated.h1>
};

const HeaderText2 = ({}) => {
    const props = useSpring({
        from: { y: 700, opacity: 0 },
        to: {y: 75, opacity: 1}
    });
    return<animated.h2 style={props} id="welcomeParagraph">Let's get to know you better, select at least 3 of the following general interests:</animated.h2>;
};

const SubmitButton = ({}) => {
    const props = useSpring({
        from: {y: 1000, opacity: 0},
        to: {y: 60, opacity: 1}
    });
    return(
        <div id="submitButtonContainer">
            <animated.button style={props} id="submitSelections">Submit</animated.button>
        </div>
    );
};

function Preferences() {
    const[on, set] = React.useState(true);

    return(
        <div className="preferencesPage">
            <HeaderText />
            <HeaderText2 />
            <Options />
            <SubmitButton />
        </div>
    );
};

export default Preferences;