const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


const url = keys.mongoURI;
const sgMail = require('@sendgrid/mail');
const { sendWelcomeEmail } = require("./welcome_emailer");

const randomCode = Math.round(Math.random() * 999999);



// Load input validation
//const validateRegisterInput = require("../../validation/register");
//const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

var token = require('../../createJWT.js');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res, next) => {

  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    notifications: true,
	  active: false,
	  activationCode: randomCode
  });
// Form validation
  //const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  /*if (!isValid) {
    return res.status(400).json(errors);
  }*/

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "User already exists" });
    }
    else {
      
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          
          newUser.password = hash;          
          
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
            sendWelcomeEmail(req.body.email, req.body.firstName, req.body.lastName, req.body.username, ('000000'+randomCode).slice(-6));
          });
      });
    }
  });

  var refreshedToken = null;
  try 
  {
    refreshedToken = token.refresh(jwtToken).accessToken;
  }
  catch(e)
  {
    console.log(e.message);
  }
  var ret = { error: error, jwtToken: refreshedToken };
  res.status(200).json(ret);
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Find user by email
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(400).json({ usernamenotfound: "User not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        var firstName = user.firstName;
        var lastName = user.lastName;
        var userId = user._id;
        var uname = user.username;
        var preferences = user.preferences;
        var attendedEvents = user.attendedEvents;
        var likedEvents = user.likedEvents;
        var email = user.email;

        var ret;
        
        try {
          const token = require("../../createJWT.js");
          ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email );
        }
        catch(e) {
          e = {error:e.message};
        }
        res.status(200).json(ret);
      } 
      else {
        return res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/preferences", async (req, res, next) => {
  const { username, preferences } = req.body;
  let query = {username:username};
  let update = {preferences:preferences};
  User.findOneAndUpdate(query, update).then(user => {
    // Check if user exists
    var ret;

    var firstName = user.firstName;
    var lastName = user.lastName;
    var userId = user._idƒ;
    var uname = user.username;
    var attendedEvents = user.attendedEvents;
    var likedEvents = user.likedEvents;
    var email = user.email;

    try {
      const token = require("../../createJWT.js");
      ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email );
    }
    catch(e) {
      console.log(e);
    }
    
    res.status(200).json(ret);
  });
});

router.post("/likes", async (req, res, next) => {
  const { username, likedEvents } = req.body;
  let query = {username:username};
  let update = {likedEvents:likedEvents};
  User.findOneAndUpdate(query, update).then(user => {
    // Check if user exists
    var ret;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var userId = user._id;
    var uname = user.username;
    var attendedEvents = user.attendedEvents;
    var preferences = user.preferences;
    var email = user.email;

    try {
      const token = require("../../createJWT.js");
      ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email );
    }
    catch(e) {
      console.log(e);
    }
    
    res.status(200).json(ret);
  });
});

router.post("/activate", async (req, res, next) => {
  isActive = true;
  
    const { username, activationCode} = req.body;
    User.findOne({ username }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(400).json({ usernamenotfound: "User not found" }); 
      }
    if(activationCode != user.activationCode){
      isActive = false; 
      console.log(isActive);
      return res.status(400).json({ activationcodeincorrect: "Activation code incorrect" });
    }
  
    let query = {username:username};
    let update = {active:isActive};
    console.log(isActive);
    User.findOneAndUpdate(query, update).then(user => {
      // Check if user exists
      var ret;
  
      var firstName = user.firstName;
      var lastName = user.lastName;
      var userId = user._id;
      var uname = user.username;
      var attendedEvents = user.attendedEvents;
      var likedEvents = user.likedEvents;
      var email = user.email;
  
      
      res.status(200).json(ret);
    });
  
    });
  });

module.exports = router;