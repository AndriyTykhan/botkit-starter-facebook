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
        const elements = [
          {
            title: 'Here is your order',
            subtitle: `Date of order: ${order[0].date}`,
            image_url: 'https://cdn3.iconfinder.com/data/icons/line/36/shopping_cart-512.png',
          },
        ];
        order[0].items.map((item) => {
          const element = {
            title: item.name,
            subtitle: `Destination: ${item.location}`,
            image_url: item.image,
            buttons: [
              {
                type: 'postback',
                title: 'Info',
                payload: `getSingleInfofor:${item.upc}`,
              },
              {
                type: 'postback',
                title: 'Repeat',
                payload: `buyItem:${item.upc}`,
              },
            ],
          };
          elements.push(element);
        });

        const attachment = {
          type: 'template',
          payload: {
            template_type: 'list',
            top_element_style: 'large',
            elements,
            buttons: [
              {
                type: 'postback',
                title: 'Return to purshases',
                payload: 'Return to purshases',
              },
            ],
          },
        };
        bot.reply(message, {
          attachment,
        });
      }
    });
};
