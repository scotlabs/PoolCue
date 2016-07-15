var Logger = require('../../helpers/logger');
var WaitingList = require('../../models/waiting');
var GameHelper = require('../../helpers/game');

exports.add = function (player, io) {
    playerName = GameHelper.formatName(player);
    if (playerName.length >= 2) {
        var playerFound = false;
        WaitingList.findOne({player: playerName}, function(error, playerRecord) {
            if (error){
                Logger.error("error adding to waiting list");
                return;
            }
            if (playerRecord){
                Logger.info("Player already on waiting list");
                return -1;
            } else {
                Logger.info('Adding player [' + player + '] to waiting list');
                var waitingList = new WaitingList();
                GameHelper.findOrCreateWaitingPlayer(waitingList, playerName, io);
                return 1;
            }
        });

       
    } else {
        Logger.warn('Error adding player [' + player + '] to waiting list');
    }
};
exports.remove = function (player, io) {
    playerName = GameHelper.formatName(player);
    if (playerName.length >= 2) {
        Logger.info('Removing player [' + player + '] from waiting list');
        GameHelper.removePlayerFromWaitingList(playerName, io);
    } else {
        Logger.warn('Error adding player [' + player + '] to waiting list');
    }
};