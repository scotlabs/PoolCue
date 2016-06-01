'use strict';

/* NPM Packages*/
var log4js = require('log4js');

/* Imports */

/* Global Variables */

/* Functions */
exports.logger = function(homeDirectory) {
    log4js.configure({
        appenders: [
            {type: 'file',
                filename: homeDirectory + '/logs/master.log',
                maxLogSize: 204800,
                backups: 10
              }]
      });

    var logger = log4js.getLogger('log');
    logger.setLevel('TRACE');

    return logger;
  };
