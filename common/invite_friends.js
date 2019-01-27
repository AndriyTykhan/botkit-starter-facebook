module.exports = async (bot, message) => {
  const botName = 'chatBotStudioTraineeBot';
  const userRef = message.sender.id;
  const link = `http://m.me/${botName}?ref=${userRef}`;

  bot.reply(message, link);
};
