require('dotenv').config();

const mongoose = require('mongoose');

const db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

db.then(() => {
  console.log('Status: OK');
}).catch((e) => {
  console.error('e');
});

if (!process.env.page_token) {
  console.log('Error: Specify a Facebook page_token in environment.');
  console.log('No page token');
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify a Facebook verify_token in environment.');
  console.log('No verify token');
  process.exit(1);
}

const Botkit = require('botkit');
const debug = require('debug')('botkit:main');

const controller = Botkit.facebookbot({
  verify_token: process.env.verify_token,
  access_token: process.env.page_token,
  studio_token: process.env.studio_token,
  studio_command_uri: process.env.studio_command_uri,
});

const webserver = require(`${__dirname}/components/express_webserver.js`)(controller);

require(`${__dirname}/components/subscribe_events.js`)(controller);
require(`${__dirname}/components/thread_settings.js`)(controller);

require(`${__dirname}/components/onboarding.js`)(controller);
require(`${__dirname}/components/plugin_glitch.js`)(controller);
require(`${__dirname}/common/identify_user.js`)(controller);

const normalizedPath = require('path').join(__dirname, 'skills');
require('fs').readdirSync(normalizedPath).forEach((file) => {
  require(`./skills/${file}`)(controller);
});


// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
  controller.on('message_received,facebook_postback', (bot, message) => {
    if (message.text) {
      controller.studio.runTrigger(bot, message.text, message.user, message.channel, message)
        .then((convo) => {
          if (!convo) {
          // no trigger was matched
          // If you want your bot to respond to every message,
          // define a 'fallback' script in Botkit Studio
          // and uncomment the line below.
            controller.studio.run(bot, 'fallback', message.user, message.channel, message);
          } else {
          // set variables here that are needed for EVERY script
          // use controller.studio.before('script') to set variables specific to a script
            convo.setVar('current_time', new Date());
          }
        }).catch((err) => {
          if (err) {
            bot.reply(message, `I experienced an error with a request to Botkit Studio: ${err}`);
            debug('Botkit Studio: ', err);
          }
        });
    }
  });
} else {
  console.log('~~~~~~~~~~');
  console.log('NOTE: Botkit Studio functionality has not been enabled');
}
