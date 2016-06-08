'use strict';

/* NPM Packages*/
var Chalk  = require('chalk');
var Moment = require('moment');
var Fs = require('fs');

/* Imports */

/* Variables */

/* Functions */
exports.debug = function(string) {
    writeToFile('debug', string);
    console.log(Chalk.cyan(timeStamp() + '[DEBUG] - ' + Chalk.reset(string)));
  };

exports.info = function(string) {
    writeToFile(' info', string);
    console.log(Chalk.green(timeStamp() + '[INFO]  - ' + Chalk.reset(string)));
  };

exports.warn = function(string) {
    writeToFile(' warn', string);
    console.log(Chalk.yellow(timeStamp() + '[WARN]  - ' + Chalk.reset(string)));
  };

exports.error = function(string) {
    writeToFile('error', string);
    console.log(Chalk.red(timeStamp() + '[ERROR] - ' + Chalk.reset(string)));
  };

exports.fatal = function(string) {
    writeToFile('fatal', string);
    console.log(Chalk.magenta(timeStamp() + '[FATAL] - ' + Chalk.reset(string)));
  };

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
