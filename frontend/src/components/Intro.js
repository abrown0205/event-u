import React, { useState } from 'react';

function signUpRedirect() {
    window.location.href = '/signup';
};
  
function loginRedirect() {
    window.location.href = '/login';
};
  
function Header() {
    return (
      <header className="indexHeader">
        <h1>EventU</h1>
        <section>
          <ul className="Links">
            <li><button className="headerBtn" onClick={signUpRedirect}>New User? Sign Up!</button></li>
            <li><button className="loginBtn" onClick={loginRedirect}>Log In</button></li>
          </ul>
        </section>
      </header>
    );
}
  
function Main() {
    return(
      <div className="Main">
        <h1>Keeping U up to date with events near campus!</h1>
        <button className="middleBtn" onClick={signUpRedirect}>Get started for free!</button>
      </div>
    );
}
  
function Footer() {
    return(
      <footer>
        <p>Project Created by Group 23</p>
      </footer>
    );
}

function Intro() {
    return(
        <div className="App">
            <Header />
            <div className="container">
                <Main />
            </div>
            <Footer />
        </div>
    );
};

export default Intro;
