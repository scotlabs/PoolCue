$(function() {
  // Initialize variables
  var $window  = $(window);
  var $playing = $('.playing');
  var socket   = io();

  /*------------------------------
    Socket.io --------------------
  ------------------------------*/

  /* Incoming socket data */
  socket.on('update data', function(data) {
        addPlayerTypeAhead(data.players);
        addNewLeaderboard(data.players);
        addNewGameToQueue(data.games);
        addNewCurrentlyPlaying(data.games[0]);
        toggleButtons();
      });

  socket.on('player stats', function(data) {
      addDataToPlayerStatsModal(data.stats);
    });

  /* Button clicks */
  $(document).ready(function() {
      socket.emit('update all');

      $('#createGame').click(function() {
          addToQueue();
          toggleButtons();
        });

      $(document).on('click','.deleteGame',function(e) {
          deleteFromQueue(this.id);
          toggleButtons();
        });

      $(document).on('click','.completeGame',function(e) {
          completeGame(this.id, $(this).attr('value'));
          toggleButtons();
        });

      $(document).on('click','.playerRow',function(e) {
          getPlayerStats(this.id);
        });

    });

  function addToQueue() {
    var player1 = cleanInput($('#player1').val());
    var player2 = cleanInput($('#player2').val());
    socket.emit('create game', player1, player2);
    resetInputBoxText();
  }

  function deleteFromQueue(gameId) {
    socket.emit('delete game', gameId);
  }

  function completeGame(gameId, winner) {
    socket.emit('complete game', gameId, winner);
  }

  function getPlayerStats(playerName) {
    socket.emit('player stats', playerName);
  }

  function addNewGameToQueue(games) {
    var $newQueue = '';
    for (var i = 1; i < games.length; i++) {
      $newQueue += queuedGameTemplate(games[i]);
    }
    $('.queue').html($newQueue);
  }

  function addNewLeaderboard(players) {
    var $leaderboardTemp = '';
    for (var i = 0; i < players.length; i++) {
      $leaderboardTemp += leaderboardRowTemplate(players[i], i);
    }

    $('.scoreboard').html($leaderboardTemp);
  }

  function addNewCurrentlyPlaying(queue) {
    if (queue && queue._id) {
      $('.playing').html(nowPlayingTemplate(queue));
    }else {
      $('.playing').html(noOnePlayingTemplate());
    }
  }

  function addDataToPlayerStatsModal(stats) {
    console.log(stats);
    $('#modalLabel').text(stats.player.name);
    $('#modalContent').html(functionName(stats));
    // Most played<br/>
  }

  function functionName(stats) {
    last10games(stats.last10games);
    var winstreak = '<div class="row">' +
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
    return winstreak;
  }

  function getWinPercentage(player) {
    if (player.wins > 0 || player.wins > 0) {
      return Math.round(player.wins / (player.wins + player.losses) * 100);
    }else {
      return '0';
    }
  }

  function last10games(games) {
    var gameString = '';
    for (var i = 0; i < games.length; i++) {
      if (games[i]) {
        gameString += '<span class="text-success">W</span>';
      }else {
        gameString += '<span class="text-danger">L</span>';
      }
    }
    return gameString;
  }

  /* Helpers */
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  function resetInputBoxText() {
    $('input[type=text]').val('');
  }

  function disableButtons() {
    $('.completeGame').attr('disabled','disabled');
    $('.completeGame').prop('disabled',true);
    $('.deleteGame').attr('disabled', 'disabled');
    $('.deleteGame').prop('disabled',true);
    $('button').attr('disabled','disabled');
    $('button').prop('disabled',true);
  }

  function toggleButtons() {
    disableButtons();

    setTimeout(function() {
        $('.completeGame').removeAttr('disabled');
        $('.completeGame').prop('disabled', false);
        $('.deleteGame').removeAttr('disabled');
        $('.deleteGame').prop('disabled',false);
        $('button').removeAttr('disabled');
        $('button').prop('disabled',false);
      }, 2000);
  }

  //Return Key
  $window.keydown(function(event) {
      if (event.which === 13) {
        addToQueue();
        resetInputBoxText();
      }
    });

  // For window focus
  $window.focus(function() {
    socket.emit('update all');
  });

  $window.blur(function() {
    disableButtons();
  });

  /*------------------------------
    Templates --------------------
  ------------------------------*/
  function nowPlayingTemplate(game) {
    return $currentlyPlaying = (
        '<div class="hidden-xs">' +
            '<div class="col-xs-3 col-xs-offset-2 text-right">' +
                '<a id="' + game._id + '" value="' + game.player1 + '" type="button" class="btn btn-lg btn-primary completeGame">' +
                    game.player1 + '&nbsp;<i class="fa fa-trophy fa-lg fa-fw text-right"></i>&nbsp;' +
                '</a>' +
            '</div>' +
            '<div class="col-xs-2 text-center">' +
                '<h4>' + 'vs.' + '</h4>' +
            '</div>' +
            '<div class="col-xs-3 text-left">' +
                '<a id="' + game._id + '" value="' + game.player2 + '" type="button" class="btn btn-lg btn-primary completeGame">' +
                    '<i class="fa fa-trophy fa-lg fa-fw text-left"></i>' + game.player2 + '</a>' +
            '</div>' +
            '<div class="col-xs-2 text-center">' +
                '<a id="' + game._id + '" class="btn btn-lg btn-danger deleteGame" role="button">' +
                    '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
                '</a>' +
            '</div>' +
        '</div>' +

        /* Small layout*/
        '<div class="visible-xs">' +
            '<div class="col-xs-4">' +
                '<a id="' + game._id + '" value="' + game.player1 + '" type="button" class="btn btn-primary completeGame">' +
                    game.player1 + '&nbsp;<i class="fa fa-trophy fa-lg fa-fw text-right"></i>&nbsp;' +
                '</a>' +
            '</div>' +
            '<div class="col-xs-1">' +
                '<h5>' + 'vs.' + '</h5>' +
            '</div>' +
            '<div class="col-xs-4">' +
                '<a id="' + game._id + '" value="' + game.player2 + '" type="button" class="btn btn-primary completeGame">' +
                    '<i class="fa fa-trophy fa-lg fa-fw text-left"></i>' + game.player2 + '</a>' +
            '</div>' +
            '<div class="col-xs-2">' +
                '<a id="' + game._id + '" class="btn btn-danger deleteGame" role="button">' +
                    '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
                '</a>' +
            '</div>' +
        '</div>'
    );
  }

  function queuedGameTemplate(game) {
    return $game = ('<div class="well">' +
                        '<div class="row">' +
                            '<div class="col-xs-1 hidden-xs"></div>' +
                            '<div class="col-xs-4 text-right">' +
                                '<h4>' + game.player1 + '</h4>' +
                            '</div>' +
                            '<div class="col-xs-1 text-center">' +
                                '<h4> vs. </h4>' +
                            '</div>' +
                            '<div class="col-xs-4 text-left">' +
                                '<h4>' + game.player2 + '</h4>' +
                            '</div>' +
                            '<div class="col-xs-2 text-center">' +
                                '<a class="btn btn-danger deleteGame queueDeleteGame" role="button" id="' + game._id + '"><i class="fa fa-close fa-fw" aria-hidden="true"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );
  }

  function leaderboardRowTemplate(player, i) {
    var $delta = (player.wins - player.losses);
    if ($delta > 0) {
      $delta = '+ ' + $delta;
    }else if ($delta < 0) {
      $delta = '- ' + Math.abs($delta);
    }
    var $position = i + 1;
    return $tableRow = ('<tr scope="row" class="playerRow"  data-toggle="modal" data-target="#myModal" id="' + player.name + '">' +
                           '<td><b>' + $position + '</b></td>' +
                           '<td><b>' + player.name + '</td>' +
                           '<td class="text-right"><b>' + player.wins + '</b></td>' +
                           '<td class="text-right"><b>' + player.losses + '</b></td>' +
                           '<td class="text-right hidden-xs"><b>' + $delta + '</b></td>' +
                           '<td class="text-right"><b>' + player.elo + '</b></td>' +
                        '</tr>');
  }

  function noOnePlayingTemplate() {
    return $noonePlaying = (
        '<div class="row text-center">' +
            '<h3> Naebody vs. Naebody<h3>' +
        '</div>' +
        '<div class="row text-center">' +
            '<p> Why not queue? </p>' +
        '</div>'
    );
  }

  /*------------------------------
    Typeahead.js -----------------
  ------------------------------*/

  function addPlayerTypeAhead(players) {
    var playerNames = [];
    if ($('#player1').typeahead && $('#player2').typeahead) {
      $('#player1').typeahead('destroy');
      $('#player2').typeahead('destroy');
    }

    for (var i in players) {
      playerNames.push(players[i].name);
    }

    substringMatcher = function(strs) {
        return function findMatches(q, cb) {
          var matches;
          var substringRegex;

          matches = [];
          substrRegex = new RegExp(q, 'i');

          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              matches.push(str);
            }
          });

          cb(matches);
        };
      };

    var datasource = {
      name: 'playerNames',
      source: substringMatcher(playerNames)
    };

    $('#player1').typeahead({
      highlight: true,
      minLength: 1
    }, datasource);

    $('#player2').typeahead({
      highlight: true,
      minLength: 1
    }, datasource);

  }

});
