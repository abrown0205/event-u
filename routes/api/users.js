const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generator = require('generate-password');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//const gen = require('random-seed'); 

const url = keys.mongoURI;
const sgMail = require('@sendgrid/mail');
const { sendWelcomeEmail } = require("./welcome_emailer");


// Load input validation
//const validateRegisterInput = require("../../validation/register");
//const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");


// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res, next) => {
  const randomCode = Math.round(Math.random() * 999999);

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
<<<<<<< HEAD
		    var active = user.active;

=======
        var active = user.active;
        var activationCode = user.activationCode;
>>>>>>> 1210dd8a5756e4a5280edf665b0d101fea0d896a
        var ret;
        
        try {
          const token = require("../../createJWT.js");
<<<<<<< HEAD
          ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active );
=======
          ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active, activationCode );
>>>>>>> 1210dd8a5756e4a5280edf665b0d101fea0d896a
        }
        catch(e) {
          e = {error:e.message};
        }
<<<<<<< HEAD
        res.status(200).json(ret);
=======
        return res.status(200).json(ret);
>>>>>>> 1210dd8a5756e4a5280edf665b0d101fea0d896a
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

router.post("/likes", async (req, res, next) => {
  const { username, likedEvents } = req.body;
  let query = {username:username};
  let update = {likedEvents:likedEvents};
  User.findOneAndUpdate(query, update).then(user => {
    // Check if user exists
    console.log(user);
    var ret;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var userId = user._id;
    var uname = user.username;
    var attendedEvents = user.attendedEvents;
    var preferences = user.preferences;
    var email = user.email;
    var active = user.active;

    try {
      const token = require("../../createJWT.js");
      ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active );
    }
    catch(e) {
      console.log(e);
    }

    res.status(200).json(ret);
  });
});

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
  const { _id, profile } = req.body;
  let query = { _id: _id };
  let passwd = profile.password.toString();
  console.log(passwd);

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

  console.log(update);
  console.log(query);
  
  // Finds the user and updates the corresponding info
  // Then, creates a jwt token and stores it.
  const set = await User.findOneAndUpdate(query, { "$set": update }).then(user => {
    console.log(user);
    var firstName = user.firstName;
    var lastName = user.LastName;
    var userId = user._id;
    var uname = user.username;
    var attendedEvents = profile.attendedEvents;
    var likedEvents = user.likedEvents;
    console.log(likedEvents);
    var preferences = user.preferences;
    var email = user.email;
    console.log("Name: " +  firstName);

    try {
      const token = require("../../createJWT.js");
      var ret = token.createToken( 
        firstName, 
        lastName, 
        userId, 
        uname,
        preferences,
        attendedEvents,
        likedEvents,
        email
      )
      res.status(200).json(ret);
    }
    catch(err) {
      console.log(err);
    }

    // Gives an Ok code of 200 and displays the token information
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
  const { _id, profile } = req.body;
  let query = { _id: _id };
  let update;  

  // The update that will take place
  if (profile.password == null) {
    update = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      username: profile.username,
    }
  }
  else {
    let passwd = profile.password.toString();
    
    // hashes password
    const password = await hashedPassword(passwd, 10);
    
    update = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      username: profile.username,
      password: password,
    }
  }

  console.log(update);
  console.log(query);
  
  // Finds the user and updates the corresponding info
  // Then, creates a jwt token and stores it.
  const set = await User.findOneAndUpdate(query, { "$set": update }).then(user => {
    console.log(user);
    var firstName = user.firstName;
    var lastName = user.LastName;
    var userId = user._id;
    var uname = user.username;
    var attendedEvents = profile.attendedEvents;
    var likedEvents = user.likedEvents;
    console.log(likedEvents);
    var preferences = user.preferences;
    var email = user.email;
    console.log("Name: " +  firstName);

    try {
      const token = require("../../createJWT.js");
      var ret = token.createToken( 
        firstName, 
        lastName, 
        userId, 
        uname,
        preferences,
        attendedEvents,
        likedEvents,
        email
      )
      res.status(200).json(ret);
    }
    catch(err) {
      console.log(err);
    }

    // Gives an Ok code of 200 and displays the token information
  });
});

router.post("/likes", async (req, res, next) => {
  const { username, likedEvents } = req.body;
  let query = {username:username};
  let update = {likedEvents:likedEvents};
  User.findOneAndUpdate(query, update).then(user => {
    // Check if user exists
    console.log(user);
    var ret;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var userId = user._id;
    var uname = user.username;
    var attendedEvents = user.attendedEvents;
    var preferences = user.preferences;
    var email = user.email;
    var active = user.active;

    try {
      const token = require("../../createJWT.js");
      ret = token.createToken( firstName, lastName, userId, uname, preferences, attendedEvents, likedEvents, email, active );
    }
    catch(e) {
      console.log(e);
    }

    res.status(200).json(ret);
  });
});



module.exports = router;

