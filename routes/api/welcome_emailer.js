const sgMail = require('@sendgrid/mail');
const { sendGridKey } = require('../../config/keys');
sgMail.setApiKey(sendGridKey);


module.exports.sendWelcomeEmail = (email, firstName, lastName, userName) =>{

    const msg = {
        to: email,
        from: {name: 'Event-U', email: 'eventuemails@gmail.com'},
        subject: 'Welcome to Event-U',        
        
        templateId: 'd-defd33f9ca94497598c4625e508fc4ba',
        dynamic_template_data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: userName
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