require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const sendGridKey = `${process.env.REACT_APP_SENDGRID_KEY}`;
sgMail.setApiKey(sendGridKey);
const express = require("express");
const router = express.Router();


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