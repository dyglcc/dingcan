'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  openid: {type : String,ref:'User'}
  ordertime:{type : Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);