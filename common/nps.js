module.exports = async (bot, message) => {
  const attachment = {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [{
        title: 'Please',
        buttons: [{
          type: 'postback',
          title: '1',
          payload: 'feedbackMark:1',
        }, {
          type: 'postback',
          title: '2',
          payload: 'feedbackMark:2',
        }, {
          type: 'postback',
          title: '3',
          payload: 'feedbackMark:3',
        }],
      },
      {
        title: 'left',
        buttons: [{
          type: 'postback',
          title: '4',
          payload: 'feedbackMark:4',
        }, {
          type: 'postback',
          title: '5',
          payload: 'feedbackMark:5',
        }, {
          type: 'postback',
          title: '6',
          payload: 'feedbackMark:6',
        }],
      },
      {
        title: 'your',
        buttons: [{
          type: 'postback',
          title: '7',
          payload: 'feedbackMark:7',
        }, {
          type: 'postback',
          title: '8',
          payload: 'feedbackMark:8',
        }, {
          type: 'postback',
          title: '9',
          payload: 'feedbackMark:9',
        }],
      },
      {
        title: 'feedback',
        buttons: [{
          type: 'postback',
          title: '10',
          payload: 'feedbackMark:10',
        }],
      }],
    },
  };

  bot.reply(message, {
    attachment,
  });
};
