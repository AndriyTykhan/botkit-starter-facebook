/* eslint-disable array-callback-return */
const { to } = require('await-to-js');
const User = require('../helpers/db/models/User');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');

const divideArr = (arr) => {
  const res = [];

  while (arr.length) {
    let max = 4;
    if (arr.length <= 4) max = arr.length;
    res.push(arr.splice(0, max));
  }
  return res;
};


module.exports = async (bot, message) => {
  let buttons = [];
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

    buttons = divideArr(buttons);

    for (let i = 0; i < buttons.length; i++) {
      const attachment = {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Here is your purshases',
              image_url: 'https://cdn3.iconfinder.com/data/icons/line/36/shopping_cart-512.png',
              buttons: buttons[i],
            },
          ],
        },
      };

      setTimeout(() => {
        bot.reply(message, {
          attachment,
        });
      }, 1000);
    }

    // while (buttons.length) {
    //   let max = 4;
    //   if (buttons.length <= 4) max = buttons.length;
    //   const resButtons = buttons.splice(0, max);

    //   console.log(resButtons);

    //   const attachment = {
    //     type: 'template',
    //     payload: {
    //       template_type: 'generic',
    //       elements: [
    //         {
    //           title: 'Here is your purshases',
    //           image_url: 'https://cdn3.iconfinder.com/data/icons/line/36/shopping_cart-512.png',
    //           buttons: resButtons,
    //         },
    //       ],
    //     },
    //   };
    //   setTimeout(() => {
    //     bot.reply(message, {
    //       attachment,
    //     });
    //   }, 0);
    // }
  }
};
