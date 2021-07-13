const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( fn, ln )
{
    return _createToken( fn, ln );
}

_createToken = function ( fn, ln, id, un, pref, ae, le, email )
{
    try
    {
      const expiration = new Date();
      const user = {firstName:fn,lastName:ln,_id:id,username:un,preferences:pref,attendedEvents:ae,likedEvents:le,email:email};

      const accessToken =  jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

      // In order to exoire with a value other than the default, use the 
       // following
      /*
      const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, 
         { expiresIn: '30m'} );
                       '24h'
                      '365d'
      */

      var ret = {accessToken:accessToken};
      console.log(ret);
    }
    catch(e)
    {
      var ret = {error:e.message};
    }
    return ret;
}

exports.isExpired = function( token )
{
   var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, 
     (err, verifiedJwt) =>
   {
     if( err )
     {
       return true;
     }
     else
     {
       return false;
     }
   });

   return isError;

}

exports.refresh = function( token )
{
  var ud = jwt.decode(token,{complete:true});

  //var userId = ud.payload.id;
  var firstName = ud.payload.firstName;
  var lastName = ud.payload.lastName;

  var userId = ud.payload._id;
  var username = ud.payload.username;
  var preferences = ud.payload.preferences;
  var attendedEvents = ud.payload.attendedEvents;
  var likedEvents = ud.payload.likedEvents;
  var email = ud.payload.email;

  return _createToken( firstName, lastName, userId, username, preferences, attendedEvents, likedEvents, email );
}
