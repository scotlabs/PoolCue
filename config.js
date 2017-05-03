var config = {};

var params = process.env;

// - Web App
config.ip_address = params.IP_Address || "localhost";
config.http_port = params.HTTP_Port || 8080;
config.https_port = params.HTTPS_Port || 8081;

// - Database Connections
config.database_host = params.Database_Host || "192.168.99.100";
config.database_port = params.Database_Port || 32768;
config.database_name = params.Database_Name || "EloEloElo";
config.database_username = params.Database_Username || "";
config.database_password = params.Database_Password || "";

module.exports = config;