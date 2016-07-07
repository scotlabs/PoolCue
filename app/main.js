requirejs.config({
  paths: {
    'text': '/scripts/requirejs-text/text',
    'durandal':'/scripts/Durandal/js',
    'plugins' : '/scripts/Durandal/js/plugins',
    'helpers' : '/app/helpers',
    'models' : '/app/models',
    'query' : '/app/query',
    'transitions' : '/scripts/Durandal/js/transitions',
    'knockout': '/scripts/knockout/dist/knockout',
    } 
});
define('jquery', function () { return jQuery; });
define('socketio', function () { return io(); });
define(function (require) {
   var system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator'),
        app = require('durandal/app');
 
   system.debug(true);
 
   app.title = 'PoolCue';
 
   app.configurePlugins({
     router:true,
     dialog: true
   });
   app.start().then(function() {
        viewLocator.useConvention('viewmodels','views');
        app.setRoot('viewmodels/shell');
   });
});