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
define('socket.io-client', function () { return io() });
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
      kinds: ['manualgame', 'waitinggame', 'currentgame', 'leaderboard', 'gamequeue']
    }
  });
  app.start().then(function () {
    viewLocator.useConvention('viewmodels', 'views');
    app.setRoot('viewmodels/shell', 'entrance');
  });
});
ko.bindingHandlers.typeahead = {
  init: function (element, valueAccessor) {
    var binding = this;
    var elem = $(element);
    var value = valueAccessor();

    // Setup Bootstrap Typeahead for this element.
    elem.typeahead({
      highlight: true,
      minLength: 1
    },
      {
        source: substringMatcher(function () {
          return ko.utils.unwrapObservable(value.source);
        }),
        onselect: function (val) {
          value.target(val);
        }
      });

    // Set the value of the target when the field is blurred.
    elem.blur(function () { value.target(elem.val()); });
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var elem = $(element);
    var value = valueAccessor();
    elem.val(value.target());
  }
};
var substringMatcher = function (source) {
  return function findMatches(query, syncResults, asyncResults) {
    var values = source().map(function (a) { return a.name; })
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(query, 'i');
    $.each(values, function (i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    syncResults(matches);
  };
};


function addDataToPlayerStatsModal(stats) {
  $('#modalLabel').text(stats.player.name);
  $('#modalContent').html(formatPlayerlayerStats(stats));
}

function formatPlayerlayerStats(stats) {
  last10games(stats.last10games);
  return '<div class="row">' +
    '<div class="text-center">' +
    '&nbsp;&nbsp;&nbsp;&nbsp;(Wins) ' + stats.player.wins + '&nbsp; - &nbsp;' +
    stats.player.losses + ' (Losses)' +
    '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-xs-6 text-right">' +
    'Win %:' +
    '</div>' +
    '<div class="col-xs-6 text-left">' +
    getWinPercentage(stats.player) + ' %' +
    '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-xs-6 text-right">' +
    'Elo:' +
    '</div>' +
    '<div class="col-xs-6 text-left">' +
    stats.player.elo +
    '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-xs-6 text-right">' +
    'Last 10:' +
    '</div>' +
    '<div class="col-xs-6 text-left">' +
    last10games(stats.last10games) +
    '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-xs-6 text-right">' +
    'Win Streak:' +
    '</div>' +
    '<div class="col-xs-6 text-left">' +
    stats.winStreak +
    '</div>' +
    '</div>' +
    '<div class="row">' +
    '<div class="col-xs-6 text-right">' +
    'Most Played:' +
    '</div>' +
    '<div class="col-xs-6 text-left">' +
    stats.playerMostPlayed.player + ' (' + stats.playerMostPlayed.games + ')' +
    '</div>' +
    '</div>';
}


function getWinPercentage(player) {
  if (player.wins > 0 || player.wins > 0) {
    return Math.round(player.wins / (player.wins + player.losses) * 100);
  } else {
    return '0';
  }
}