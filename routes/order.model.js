'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
  openid: String,
  ordertime:{type : Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);