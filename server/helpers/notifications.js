var Logger = require('./logger');
var Players = require('../models/player');

var cfg = {};
/* Settings */
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
// var isConfigured = requiredConfig.every(function(configValue) {
//   return configValue || false;
// });


exports.SendNotifications = function(gamesList){
    // if (!isConfigured) {
    //     var errorMessage = 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
    //     Logger.error(errorMessage);
    //     return;
    // }
    // Notifications are only sent when your game is two (or more) deep 
    if (gamesList.length < 2) {
        Logger.warn('Notification Hub was called when not enough games exist?');
        return;
    }
    var nextbutoneGame = gamesList[1];
    if (nextbutoneGame === null) {
        return;
    }
    try{
        checkPlayerNotifications(nextbutoneGame.player1);
        checkPlayerNotifications(nextbutoneGame.player2);
    } catch (err) {
        Logger.error(err);
    }
}

function checkPlayerNotifications(currentPlayer){
    Players.findOne({name: currentPlayer, mobile_number: {$ne: null}, enableNotification: true}, function(error, player) {
        if (player.name !== null || player.mobile_number !== null){
            sendMessage(player.name, player.mobile_number, currentPlayer);
        }
    });
}

function sendMessage(name, mobile_number, against){
    Logger.info("Sending message to " + name + " @ " + mobile_number);
    sendSms(mobile_number, "Your game against " + against + " is up next " + name + " !, From PoolCue");
}

sendSms = function(to, message) {
    var client = require('twilio')(cfg.accountSid, cfg.authToken);

    client.messages.create({body: message, to: to, from: cfg.sendingNumber }, function(err) {
        if (err) {
            Logger.error('Could not send notification ' + err);
        } else {
            Logger.info('Notification sent to ' + to);
        }
    });
};