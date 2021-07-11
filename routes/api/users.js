const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const url = keys.mongoURI;
console.log(url);
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

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
    notifications: true
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
          console.log(newUser);
          
          
          /*newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err + " this is where my error is"));*/
          });
      });
    }
   
  });

  try
  {
    const db = client.db();
    const result = await db.collection('users').insertOne(newUser);
    console.log(result);
  }
  catch(e)
  {
    error = e.toString();
    console.log(error);
  }

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
        var ret;
        
        try {
          const token = require("../../createJWT.js");
          ret = token.createToken( firstName, lastName );
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

module.exports = router;