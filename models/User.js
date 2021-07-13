
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
     username: {
        type: 'string',
        description: 'must be a string'
      },
      password: {
        type: 'string',
        description: 'must be a string'
      },
      firstName: {
        type: 'string',
        description: 'must be a string'
      },
      lastName: {
        type: 'string',
        description: 'must be a string'
      },
      preferences: {
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'string',
          'enum': [
            'sports',
            'music',
            'studying',
            'arts & culture',
            'shopping',
            'science'
          ],
          description: 'must be one of the enum options'
        }
      },
      email: {
        type: 'string',
        description: 'must be a string'
      },
	  createdEvents: {
        type: 'array',
        items: {
          type: 'objectId',
          description: 'must be an eventId of a corresponding event'
        }
      },
      attendedEvents: {
        type: 'array',
        items: {
          type: 'objectId',
          description: 'must be an eventId of a corresponding event'
        }
      },
	  likedEvents: {
        type: 'array',
        items: {
          type: 'objectId',
          description: 'must be an eventId of a corresponding event'
        }
      },
      notifications: {
        type: 'bool',
        description: 'must be a boolean'
      }
},  {versionKey: false} );
module.exports = User = mongoose.model("users", UserSchema);