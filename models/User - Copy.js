const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  username: {
    type: 'string',
    //required: true
  },
  password: {
    type: 'string',
    //required: true
  },
  firstName: {
    type: 'string',
    //required: true
  },
  lastName: {
    type: 'string',
    //required: true
  },
  preferences: {
    type: 'array',
	items: { type: 'string' },
	uniqueItems: true
    //required: true
  },
  email: {
    type: 'string',
    //required: true
  },
  phone: {
    type: 'number',
    //required: true
  },
  attendedEvents: {
    type: 'array',
	items: { type: 'number' },
	uniqueItems: true
  },
  likedEvents: {
    type: 'array',
	items: { type: 'number' },
	uniqueItems: true
  },
  notifications: {
    type: 'boolean',
    //required: true
  }
},  {versionKey: false} );
module.exports = User = mongoose.model("users", UserSchema);