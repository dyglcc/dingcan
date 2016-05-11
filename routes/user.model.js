'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  openid: String,
  always: {type:Boolean,default:false}
});

module.exports = mongoose.model('User', UserSchema);