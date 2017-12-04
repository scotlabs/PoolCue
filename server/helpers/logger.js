"use strict";

/* NPM Modules */
const _winston = require("winston");

/* My Modules */
const _config = require("../../config");

const logger = new _winston.Logger({
    transports: [
        new _winston.transports.Console({
            timestamp: true,
            colorize: true,
            level: _config.loggerConsoleLevel
        })
    ]
});

module.exports = logger;

_winston.Logger.prototype.clear = function() {
    process.stdout.write("\x1Bc");
};

_winston.Logger.prototype.stream = {
    write: function(message, encoding) {
        logger.verbose(message);
    }
};