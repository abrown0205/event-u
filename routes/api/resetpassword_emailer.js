const sgMail = require('@sendgrid/mail');
const { sendGridKey } = require('../../config/keys');
sgMail.setApiKey(sendGridKey);
const express = require("express");
const router = express.Router();
const generator = require('generate-password');
const bcrypt = require("bcryptjs");

router.post("/endPasswordResetEmail", async (req, res, next) => {
    const {username} = req.body;
    var firstName;
    var lastName;
    var email;
    var userName;
    var password;
    User.findOne({username: username}).then(user=> {
        if(!user)
            return res.status(400).json({error: "User doesn't exist"});
        else {
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
                    let query = {username: user.username};
                    let update = {password: encryptedPassword}

                    User.findOneAndUpdate(query, update).exec();
                });
            });
        }
    })
    
    const msg = {
        to: email,
        from: {name: 'Event-U', email: 'eventuemails@gmail.com'},
        subject: 'Event-U Password Reset Request',        
        
        templateId: 'd-b8a63ade016d4fd4904ca88fc9401c7f',
        dynamic_template_data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: userName,
            password: password
          }, 
    }

    
    
    sgMail.send(msg, function(err, info){
        if(err){
            console.log('Email not sent');
        } else {
            console.log('Email Sent successfully');
        }
    });

});

module.exports = router;