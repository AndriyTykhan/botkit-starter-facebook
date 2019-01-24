/* eslint-disable array-callback-return */
const { to } = require('await-to-js');
const User = require('../helpers/db/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');


module.exports = async (bot, message, date) => {
  const senderPsid = message.sender.id;

  await User.findOne({ psid: senderPsid })
    .exec((error, user) => {
      if (error) throw new BotError(errors.findUserError);

      const order = user.purshases.filter(item => item.date === date);

      if (!order) {
        bot.reply(message, 'Cant find order');
      } else {
        console.log(order);
        let items;
        order.CoreMongooseArray[0].items.map((item) => {
          const element = {
            title: item.name,
            image_url: item.image,
            subtitle: `Destination: ${item.location}`,
            buttons: [
              {
                type: 'postback',
                title: 'Repeat ?',
                payload: `buyItem:${item.upc}`,
              },
              {
                type: 'postback',
                title: 'Return',
                payload: 'My purchases',
              },
            ],
          };
        });
      }
    });
};
