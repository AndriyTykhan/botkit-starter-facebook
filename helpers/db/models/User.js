const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopingList = {
  name: { type: String },
  upc: { type: String },
  image: { type: String },
  description: { type: String },
};

const Purshases = {
  items: {},
  date: { type: String },
  location: {},
};

const UserShema = new Schema({
  psid: { type: String },
  name: { type: String },
  phone: { type: Number },
  referrals: [],
  shopingList: [shopingList],
  purshases: [Purshases],

});

const User = mongoose.model('User', UserShema);

module.exports = User;
