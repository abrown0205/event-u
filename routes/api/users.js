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
		var active = user.active;

        var ret;
        
        try {
          const token = require("../../createJWT.js");
          ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email );
        }
        catch(e) {
          e = {error:e.message};
        }
		ret["active"] = active;
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
    var userId = user._id;
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

// hashes any password passed to it
const hashedPassword = async (passwd, saltRounds) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash Password and return it
    const password = await bcrypt.hash(passwd, salt);
    return password;

  }
  catch(err) {
    console.log(error);
  }

  // Returns null if an error occurred
  return null;
}

// edits the user info
router.post("/editUser", async (req, res, next) => {
  
  // collects info as necessary
  const {username, profile} = req.body;
  let query = {username: username};
  let passwd = profile.password.toString();

  // hashes password
  const password = await hashedPassword(passwd, 10);

  // The update that will take place
  const update = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    username: profile.username,
    password: password,
  }
  
  // Finds the user and updates the corresponding info
  // Then, creates a jwt token and stores it.
  User.findOneAndUpdate(query, update).then(user => {
    var firstName = profile.firstName;
    var lastName = profile.LastName;
    var userId = profile._id;
    var uname = profile.username;
    var password = password;
    var attendedEvents = profile.attendedEvents;
    var likedEvents = profile.likedEvents;
    var preferences = profile.preferences;
    var email = profile.email;

    try {
      const token = require("../../createJWT.js");
      var ret = token.createToken( 
        firstName, 
        lastName, 
        userId, 
        uname, 
        password,
        attendedEvents,
        likedEvents,
        preferences,
        email    
      )
    }
    catch(err) {
      console.log(err);
    }

    // Gives an Ok code of 200 and displays the token information
    res.status(200).json(ret);
  });
});


module.exports = router;