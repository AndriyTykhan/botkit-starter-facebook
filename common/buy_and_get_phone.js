/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
const { to } = require('await-to-js');
const User = require('../helpers/db/models/User');
const Goods = require('../helpers/db/models/Good');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');


module.exports = async (bot, message, upc) => {
  let content_type;
  let text;
  const senderPsid = message.sender.id;

  const [dbErr, good] = await to(Goods.findOne({ upc }));
  if (dbErr) throw new BotError(errors.findGoodsError);

  const user = await User.findOne({ psid: senderPsid }, (error, usr) => {
    if (error) throw new BotError(errors.findUserError);

    usr.shopingList.push(good);

    usr.save((err) => {
      if (err) {
        if (err) throw new BotError(errors.saveDbError);
      }
    });
  });

  if (user.phone) {
    content_type = 'location';
    text = 'Please share your location for delivery';
  } else {
    content_type = 'user_phone_number';
    text = 'Please share your phone';
  }

  bot.reply(message, {
    text,
    quick_replies: [
      {
        content_type,
      },
    ],
  });
};
