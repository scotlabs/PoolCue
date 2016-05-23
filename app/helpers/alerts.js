'use strict';

/* NPM Packages*/
var Chalk  = require('chalk');
var Moment = require('moment');

/* Imports */

/* Variables */

/* Functions */

exports.timeStamp = function() {
  return Chalk.cyan('[' + new Moment().format('HH:mm:ss:SSS') + '] ');
};

exports.warningMessage = function(string) {
  console.log(this.timeStamp() + Chalk.bgYellow.black('WARNING - ' + string));
};

exports.errorMessage = function(type, string) {
  console.error(this.timeStamp() + Chalk.bgRed.white('[ERROR - ' + type.toUpperCase() + ']' + Chalk.bgBlack(' ' + string)));
};

exports.systemMessage = function(type, string) {
  console.log(this.timeStamp() + Chalk.yellow('[' + type.toUpperCase() + '] ') + Chalk.magenta(string));
};

exports.logMessage = function(type, string) {
  console.log(this.timeStamp() + Chalk.green('[Log - ' + type + '] ') + string);
};
