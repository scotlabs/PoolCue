var config = {};

var params = process.env;

// - Web App
config.ip_address = params.IP_Address || "localhost";
config.http_port = params.HTTP_Port || 8080;
config.https_port = params.HTTPS_Port || 8081;

// - Database Connections
config.database_ip = params.Database_IP || "localhost";
config.database_port = params.Database_Port || 27017;
config.database_name = params.Database_Name || "EloEloElo";


module.exports = config;