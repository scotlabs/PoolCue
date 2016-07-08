var WaitingList       = require('../../models/waiting');
var GameHelper = require('../../helpers/game');
exports.addToWaitingList = function (player, io) {
    player = GameHelper.formatName(player1);
    if (player.length >= 2) {
        Logger.info('Adding player [' + player + '] to waiting list');
        var game = new Game();
        GameHelper.findOrCreatePlayer(game, player1, io);
        GameHelper.findOrCreatePlayer(game, player2, io);
    } else {
        Logger.warn('Error adding player [' + player + '] to waiting list');
    }
};