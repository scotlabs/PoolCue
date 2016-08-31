var Logger = require('./logger');
var Players = require('../models/player');

var cfg = {};
/* Settings */
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});


exports.SendNotifications = function(gamesList){
    /*if (!isConfigured) {
        var errorMessage = 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
        Logger.error(errorMessage);
        return;
    }*/
    if (gamesList.length < 1) {
        Logger.warn('Notification Hub was called when no games exist?');
        return;
    }
    var nextGame = gamesList[0];
    if (nextGame == null) {
        return;
    }
    try{
        var player1WithMobile =  Players.findOne({name: nextGame.player1, mobile_number: {$ne: null}}, function(error, player) {
            if (player.name == null || player.mobile_number == null)
                return;
            sendMessage(player.name, player.mobile_number);
        });;
        var player2WithMobile =  Players.findOne({name: nextGame.player2, mobile_number: {$ne: null}}, function(error, player) {
            if (player.name == null || player.mobile_number == null)
                return;
            sendMessage(player.name, player.mobile_number);
        });;
    } catch (error) {

    }
}

function sendMessage(name, mobile_number){
    sendSms(mobile_number, "Your game is up next" + name + " !, From PoolCue");
}

sendSms = function(to, message) {
    var client = require('twilio')(cfg.accountSid, cfg.authToken);

  client.messages.create({
    body: message,
    to: to,
    from: cfg.sendingNumber
  }, function(err, data) {
    if (err) {
      Logger.error('Could not send notification');
      Logger.error(err);
    } else {
      Logger.log('Notification sent to ' + to);
    }
  });
};