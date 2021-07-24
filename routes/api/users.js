const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generator = require('generate-password');
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
  var ret;

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
          
          newUser.save(function(err, usr) {
            
            if(err) {
              console.log(err);
            }
            try
            { 
              const token = require("../../createJWT.js");
              ret = token.createToken( usr.firstName, usr.lastName, usr._id, usr.username, usr.preferences, usr.attendedEvents, usr.likedEvents, usr.email, usr.active, usr.activationCode );
              return res.status(200).json(ret);
            }
            catch(e)
            {
              console.log(e.message);            
            }
          });
          
        });
      });
    }
  });
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
        var activationCode = user.activationCode;
        var ret;
        
        try {
          const token = require("../../createJWT.js");
          ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active, activationCode );
        }
        catch(e) {
          e = {error:e.message};
        }
        return res.status(200).json(ret);
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
    var active = user.active;
    var activationCode = user.activationCode

    try {
      const token = require("../../createJWT.js");
      ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active, activationCode );
    }
    catch(e) {
      console.log(e);
    }
    
    res.status(200).json(ret);
  });
});

router.post("/activate", async (req, res, next) => {
  isActive = true;

  const { username} = req.body;
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(400).json({ usernamenotfound: "User not found" }); 
    }

    let query = {username:username};
    let update = {active:true};
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
      var active = user.active;
      var activationCode = user.activationCode;
      var preferences = user.preferences;

      try {
        const token = require("../../createJWT.js");
        ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active, activationCode );
      }
      catch(e) {
        console.log(e);
      }
      
      res.status(200).json(ret);
    });
  });
});

router.post("/activate", async (req, res, next) => {
  const { username, active} = req.body;
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(400).json({ usernamenotfound: "User not found" }); 
    }

    let query = {username:username};
    let update = {active:active};
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
      var active = user.active;
      var preferences = user.preferences
      var activationCode = user.activationCode;
      
      try {
        const token = require("../../createJWT.js");
        ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active, activationCode );
      }
      catch(e) {
        e = {error:e.message};
      }
      res.status(200).json(ret);
    });

  });
});

router.post('/sendWelcomeEmail', async(req, res, next)  =>{
  const {username, firstName, lastName, email, activationCode} = req.body;

  const msg = {
      to: email,
      from: {name: 'Event-U', email: 'eventuemails@gmail.com'},
      subject: 'Welcome to Event-U',        
      
      templateId: 'd-8478920a342349adabde9b1a091a1b45',
      dynamic_template_data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
          activation_code: activationCode
        },
  }
  
  var ret;
  sgMail.send(msg)
      .then(() => {
          console.log('Message sent');
          ret = '';
          res.status(200).json(ret);
      })
      .catch((error) => {
          ret = { error: error };
          res.status(500).json(ret);
      })
});

router.post("/sendPasswordResetEmail", async (req, res, next) => {
  const {username} = req.body;
  console.log(username);
  var firstName;
  var lastName;
  var email;
  var userName;
  var password;
  User.findOne({username: username}).then(user => {
    console.log(username);
    console.log(user);
    firstName = user.firstName;
    lastName = user.lastName;
    email = user.email;
    userName = user.username;
    password = generator.generate({
        length: 10,
        numbers: true
    })
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if(err) throw err;

          var encryptedPassword = hash;
          user.password = encryptedPassword;

          user.save();

          const msg = {
            to: email,
            from: {name: 'Event-U', email: 'eventuemails@gmail.com'},
            subject: 'Event-U Password Reset Request',        
            
            templateId: 'd-610d7d33edea402abca50c951a9741b5',
            dynamic_template_data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: userName,
                password: password
            }, 
          }
          console.log(msg);
          
          sgMail.send(msg).then(() => {
            console.log('Message sent');
            ret = '';
            res.status(200).json(ret);
          })
          .catch((error) => {
            ret = { error: error };
            res.status(500).json(ret);
          })
        });
    });
  })
});

module.exports = router;

