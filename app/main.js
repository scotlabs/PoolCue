requirejs.config({
  paths: {
    'text': '/scripts/requirejs-text/text',
    'durandal': '/scripts/Durandal/js',
    'plugins': '/scripts/Durandal/js/plugins',
    'transitions': '/scripts/Durandal/js/transitions',
    'slots': '/bower_components/jQuery-SlotMachine/dist/jquery.slotmachine.min',
    'helpers': '/app/helpers',
    'models': '/app/models',
    'query': '/app/query',
  }
});
define('knockout', function () { return ko; });
define('jquery', function () { return jQuery; });
define('socket.io-client', function () { return io(); });
define(function (require) {
  var system = require('durandal/system'),
    viewLocator = require('durandal/viewLocator'),
    app = require('durandal/app');

  system.debug(true);

  app.title = 'PoolCue';

  app.configurePlugins({
    router: true,
    dialog: true,
    widget: {
        kinds: ['manualgame','waitinggame','currentgame','leaderboard','gamequeue']
    }
  });
  app.start().then(function () {
    viewLocator.useConvention('viewmodels', 'views');
    app.setRoot('viewmodels/shell', 'entrance');
  });
});


ko.bindingHandlers.typeahead = {
  init: function (element, valueAccessor, bindingAccessor) {
    var substringMatcher = function (strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
          // console.log(str);
          if (substrRegex.test(str)) {
            // the typeahead jQuery plugin expects suggestions to a
            // JavaScript object, refer to typeahead docs for more info
            matches.push({
              value: str
            });
          }
        });

        cb(matches);
      };
    };
    var $e = $(element),
      options = valueAccessor();

    console.dir(options.source());

    console.dir($e);

    // passing in `null` for the `options` arguments will result in the default
    // options being used
    $e.typeahead({
      highlight: true,
      minLength: 2
    }, {
        source: substringMatcher(options.source())
      }).on('typeahead:selected', function (el, datum) {
        console.dir(datum);
      }).on('typeahead:autocompleted', function (el, datum) {
        console.dir(datum);
      });

  }
};