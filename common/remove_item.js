/* eslint-disable no-param-reassign */
const { to } = require('await-to-js');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');
const User = require('../helpers/db/models/User');

module.exports = async (bot, message, upc) => {
  const senderPsid = message.sender.id;
  await User.findOne({ psid: senderPsid })
    .exec((error, user) => {
      if (error) throw new BotError(errors.findUserError);
      user.shopingList = user.shopingList.filter(el => el.upc !== upc);
      user.save((err) => {
        if (err) throw new BotError(errors.saveDbError);
      });
    });

  bot.reply(message, 'Item removed');
};
