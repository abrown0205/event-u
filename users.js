const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//load sendGrid for welcome email and password reset
const sgMail = require('@sendgrid/mail');
const { sendWelcomeEmail } = require("./welcome_emailer");
const { sendPasswordResetEmail } = require("./resetpassword_emailer.js")
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const { getMaxListeners } = require("../../models/User");
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ username: "User already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
        password: req.body.password,
		email: req.body.email,
		phone: req.body.phone,
		notifications: true
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
            sendWelcomeEmail(req.body.email, req.body.firstName, req.body.lastName, req.body.username);
        });
      });
    }
  });
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const username = req.body.username;
  const password = req.body.password;
// Find user by email
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "User not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/resetpassword", (req, res) => {
  
  const useremail = req.body.email;
  // Find user by email
  User.findOne({ email: useremail }).then(user => {

    if(!user){
      //no account with this email
      return res.status(404).json({
        message: "email not found",
        email: useremail
       });
    } else {
      //there is an account with this email
      //generate and hash a new password
      newPass = Math.random().toString(36).substring(7);
      //email new password to user
      sendPasswordResetEmail(user.email, user.firstName, user.lastName, user.username, newPass);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPass, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));            
        });
      });
      //return JSON result password has been reset
      return res.status(200).json({
        message: "password successfully reset",
        email: useremail,
        // username: user.username,
        // newpassword: newPass,
        // hashedpassword: user.password        
       });
    }     
    
  });
 
  
});
module.exports = router;