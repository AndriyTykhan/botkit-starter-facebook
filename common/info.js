const { to } = require('await-to-js');
const store = require('../helpers/bestbuy/store.js');
const BotError = require('../helpers/errors/error');
const errors = require('../helpers/errors/error-messages');
const User = require('../helpers/db/models/User');
const Goods = require('../helpers/db/models/Good');

module.exports = async (bot, message, upc) => {
  const senderPsid = message.sender.id;

  const [dberr, good] = await to(Goods.findOne({ upc }));
  if (dberr) throw new BotError(errors.findGoodsError);

  const attachment = {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: good.name,
          image_url: good.image,
          subtitle: good.description,
          buttons: [
            {
              type: 'postback',
              title: 'Buy',
              payload: `buyItem:${good.upc}`,
            },
            {
              type: 'postback',
              title: 'Main menu',
              payload: 'Main menu',
            },
          ],
        },
      ],
    },
  };

  bot.reply(message, {
    attachment,
  });
};
