/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const moment = require('moment');
const User = require('../helpers/db/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

module.exports = function (controller) {
  controller.on('message_received', async (bot, message) => {
    const senderPsid = message.sender.id;

    if (!message.text) {
      if (message.attachments && message.attachments[0]) {
        let location;
        if (message.attachments[0].payload.coordinates) {
          location = message.attachments[0].payload.coordinates;
        }

        await User.findOne({ psid: senderPsid })
          .exec((error, user) => {
            if (error) throw new BotError(errors.findUserError);
            let order = user.shopingList.CoreMongooseArray;
            const date = moment().format("MMM Do ");
            
            order = { date, items: user.shopingList, location };
            
            user.purshases.push(order);
            user.shopingList = [];
            user.save((err) => {
              if (err) {
                throw new BotError(errors.saveDbError);
              }
            });
          });
        bot.reply(message, 'Our courier will contact you within 2 hours');
      }
    }
  });

  controller.on('sticker_received', (bot, message) => {
    bot.reply(message, 'Cool sticker.');
  });

  controller.on('image_received', (bot, message) => {
    bot.reply(message, 'Nice picture.');
  });

  controller.on('audio_received', (bot, message) => {
    bot.reply(message, 'I heard that!!');
  });
};
