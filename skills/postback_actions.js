/* eslint-disable no-param-reassign */
const mainMenu = require('../common/main_menu');
const info = require('../common/info');
const buyAndGetPhone = require('../common/buy_and_get_phone');
const shopingList = require('../common/shoping_list');
const getOrderByDate = require('../common/get_order_by_date');
const quickReply = require('../common/singe_quick_reply');
const removeItem = require('../common/remove_item');
const User = require('../helpers/db/models/User');

module.exports = (controller) => {
  controller.on('facebook_postback', async (bot, message) => {
    let id;
    let messagePayload = message.payload;
    const senderPsid = message.sender.id;
    const user = await User.findOne({ psid: senderPsid });
    if (messagePayload.match('getSingleInfofor:')) {
      [messagePayload, id] = messagePayload.split(':');
    }
    if (messagePayload.match('buyItem:')) {
      [messagePayload, id] = messagePayload.split(':');
    }
    if (messagePayload.match('RemoveItem:')) {
      [messagePayload, id] = messagePayload.split(':');
    }
    if (messagePayload.match('getOrderByDate:')) {
      [messagePayload, id] = messagePayload.split(':');
    }

    switch (messagePayload) {
      case 'Get Started':
      case 'Main menu':
        mainMenu(bot, message);
        break;
      case 'getSingleInfofor':
        info(bot, message, id);
        break;
      case 'buyItem':
        buyAndGetPhone(bot, message, id);
        break;
      case 'RemoveItem':
        removeItem(bot, message, id);
        break;
      case 'getOrderByDate':
        getOrderByDate(bot, message, id);
        break;
      case 'List of goods':
        shopingList(bot, message);
        if (user.shopingList.length) {
          setTimeout(() => {
            quickReply(bot, message, 'Buy all');
          }, 1000);
        } else {
          setTimeout(() => {
            quickReply(bot, message, 'Go to shop');
          }, 1000);
        }
        break;
      default:
        bot.reply(message, 'Unknown commnand');
        break;
    }
  });
};
