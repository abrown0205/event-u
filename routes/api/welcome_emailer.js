const sgMail = require('@sendgrid/mail');
const { sendGridKey } = require('../../config/keys');
sgMail.setApiKey(sendGridKey);


module.exports.sendWelcomeEmail = (email, firstName, lastName, username, randomCode) =>{

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
			activation_code: randomCode
          },  
    }

    
    sgMail.send(msg).then(() => {
    console.log('Message sent')
}).catch((error) => {
    console.log(error.response.body)
    // console.log(error.response.body.errors[0].message)
})
    //sgMail.send(msg, function(err, info){
    //    if(err){
	//		console.error(err);
    //        console.log('Email not sent');
    //    } else {
    //        console.log('Email Sent successfully');
    //    }
    //});

}