/* NPM Packages*/

/* Imports */

/* Global Variables */

// Maybe split into to files later if this grows.
// error.sendErrorMissingParameterData
// success.sendOk
exports.sendErrorMissingParameterData = function(response) {
    response.status(400).send('Missing parameter data');
};

exports.sendSuccessOk = function(response){
    response.send(200);
}