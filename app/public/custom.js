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
      resetInputBoxText();
    });

  /* Button clicks */
  $(document).ready(function() {
      socket.emit('update all');

      $('#createGame').click(function() {
          addToQueue();
        });

      $(document).on('click','.deleteGame',function(e) {
          deleteQueue(this.id);
        });

      $(document).on('click','.completeGame',function(e) {
          completeGame(this.id, $(this).attr('value'));
        });
    });

  function addToQueue() {
    var player1 = cleanInput($('#player1').val());
    var player2 = cleanInput($('#player2').val());

    socket.emit('create game', player1, player2);
  }

  function deleteQueue(gameId) {
    socket.emit('delete game', gameId);
  }

  function completeGame(gameId, winner) {
    socket.emit('complete game', gameId, winner);
  }

  function addNewGameToQueue(games) {
    if (games) {
      var $newQueue = '';
      for (var i = 1; i < games.length; i++) {
        $newQueue += queuedGameTemplate(games[i]);
      }
      $('.queue').html($newQueue);
    }
  }

  function addNewLeaderboard(players) {
    var $leaderboardTemp = '';
    if (players) {
      for (var i = 0; i < players.length; i++) {
        $leaderboardTemp += leaderboardRowTemplate(players[i], i);
      }

      $('.scoreboard').html($leaderboardTemp);
    }
  }

  function addNewCurrentlyPlaying(queue) {
    if (queue && queue._id) {
      $('.playing').html(nowPlayingTemplate(queue));
    }else {
      $('.playing').html(noOnePlayingTemplate());
    }
  }
  /* Helpers */
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  function resetInputBoxText() {
    $('#player1').val('');
    $('#player2').val('');
  }

  $window.keydown(function(event) {
      if (event.which === 13) {
        addToQueue();
      }
    });

  /*------------------------------
    Templates --------------------
  ------------------------------*/

  // <div class="col-xs-4 col-xs-offset-1 text-right">
  //     <input type="text" class="form-control" id="player1" name="player1" minlength="2" maxlength="50" placeholder="Player 1">
  // </div>
  // <div class="col-xs-1 text-center">
  //     <label><h4>vs.</h4></label>
  // </div>
  // <div class="col-xs-4 text-left">
  //       <input style="width:100%;" type="text" class="form-control" id="player2" name="player2" minlength="2" maxlength="50" placeholder="Player 2">
  // </div>
  //
  // <div class="col-xs-2 text-center">
  //     <button id="createGame" class="btn btn-primary"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></button>
  // </div>
  function nowPlayingTemplate(game) {
    return $currentlyPlaying = (
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
        '</div>');
  }

  function queuedGameTemplate(game) {
    return $game = ('<div class="well">' +
                        '<div class="row">' +
                            '<div class="col-xs-4 col-xs-offset-1 text-right">' +
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
                    '</div>');
  }

  function leaderboardRowTemplate(player, i) {
    var $delta = (player.wins - player.losses);
    var $position = i + 1;
    return $tableRow = ('<tr scope="row">' +
                           '<td><b>' + $position + '</b></td>' +
                           '<td><b>' + player.name + '</td>' +
                           '<td class="text-right"><b>' + player.wins + '</b></td>' +
                           '<td class="text-right"><b>' + player.losses + '</b></td>' +
                           '<td class="text-right"><b>' + $delta + '</b></td>' +
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
