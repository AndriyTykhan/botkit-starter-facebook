/* eslint-disable array-callback-return */
const { to } = require('await-to-js');
const User = require('../helpers/db/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');


module.exports = async (bot, message) => {
  const buttons = [];
  const senderPsid = message.sender.id;
  const [err, user] = await to(User.findOne({ psid: senderPsid }));
  if (err) throw new BotError(errors.findUserError);

  if (!user.purshases.length) {
    bot.reply(message, 'You have no purshases');
  } else {
    user.purshases.map((el) => {
      const element = {
        type: 'postback',
        title: el.date,
        payload: `getOrderByDate:${el.date}`,
      };
      buttons.push(element);
    });

    const attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Here is your purshases',
            image_url: 'https://cdn3.iconfinder.com/data/icons/line/36/shopping_cart-512.png',
            buttons,
          },
        ],
      },
    };

    bot.reply(message, {
      attachment,
    });
  }
};
