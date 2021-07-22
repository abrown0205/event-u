const sgMail = require('@sendgrid/mail');
const { sendGridKey } = require('../../config/keys');
sgMail.setApiKey(sendGridKey);


module.exports.sendPasswordResetEmail = (email, firstName, lastName, userName, password) =>{

    const msg = {
        to: email,
        from: {name: 'Event-U', email: 'eventuemails@gmail.com'},
        subject: 'Welcome to Event-U',        
        
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

}