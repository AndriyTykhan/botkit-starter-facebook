/* eslint-disable func-names */
const axios = require('axios');
const { to } = require('await-to-js');
const User = require('../helpers/db/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

const getName = async (url) => {
  const [err, response] = await to(axios.get(url));
  if (err) throw new BotError(errors.getUserData);
  const data = response.data;
  return `${data.first_name} ${data.last_name}`;
};

module.exports = function (controller) {
  controller.on('message_received', async (bot, message) => {
    let fullName;
    const senderPsid = message.sender.id;

    let user = await User.findOne({ psid: senderPsid });

    if (!user) {
      const usersPublicProfile = `https://graph.facebook.com/v2.6/${senderPsid}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${process.env.page_token}`;
      fullName = await getName(usersPublicProfile);

      user = new User({
        psid: senderPsid,
        name: fullName,
        phone: '',
        shopingList: [],
        myPurshases: [],
      });

      user.save((err) => {
        if (err) throw new BotError(errors.saveDbError);
      });
    }

    if (message.referral) {
      User.findOne({ psid: message.referral.ref }, (err, usr) => {
        if (err) throw new BotError(errors.findUserError);
        if (!usr.referrals.includes(fullName)) usr.referrals.push(fullName);
        usr.save((error) => {
          if (error) throw new BotError(errors.saveDbError);
        });
      });
    }
  });
};
