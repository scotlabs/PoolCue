'use strict';

/* NPM Packages*/
var Fs     = require('fs');
var Chalk  = require('chalk');
var Moment = require('moment');

/* Functions */
exports.debug = function(message) {
    logIt('debug', Chalk.cyan, message);
  };

exports.info = function(message) {
  logIt('info', Chalk.green, message);
};

exports.warn = function(message) {
  logIt('warn', Chalk.yellow, message);
};

exports.error = function(message) {
  logIt('error', Chalk.red, message);
};

exports.fatal = function(message) {
  logIt('fatal', Chalk.magenta, message);
};

exports.sockets = function(sockets) {
  var message;
  if(sockets.id){
    message = 'Pushing data to socket: ' + sockets.id;
  }else{
    message = 'Pushing data to all sockets';
  }
  logIt('socket', Chalk.orange, message)
};

function logIt(type, colour, message){
  writeToFile(type, message);
  console.log(colour(timeStamp() + '[' + type.toUpperCase() + ']  - ' + Chalk.reset(message)));
}

function writeToFile(prefix, message) {
  var formattedMessage = timeStamp() + '[' + prefix.toUpperCase() + '] - ' + message;
  try {
    Fs.appendFileSync('logs/' + prefix.replace(' ', '') + '.log', formattedMessage + '\n');
    Fs.appendFileSync('logs/master.log', formattedMessage + '\n');
  }catch (error) {
    console.log(Chalk.magenta(timeStamp() + '[FATAL] - ' + Chalk.reset('Create a /logs folder first.')));
  }
}

function timeStamp() {
  return '[' + new Moment().format('DD-MMM-YYYY HH:mm:ss:SSS') + '] ';
};
