$(function() {
  // Initialize variables
  var $window = $(window);
  var $playing = $('.playing');
  var $queue = $('.queue');
  var $scoreboard = $('.scoreboard');
  var playerNames = [];
  var socket = io();

  /**
  _____               _           _       _
 /  ___|             | |         | |     (_)
 \ `--.   ___    ___ | | __  ___ | |_     _   ___
  `--. \ / _ \  / __|| |/ / / _ \| __|   | | / _ \
 /\__/ /| (_) || (__ |   < |  __/| |_  _ | || (_) |
 \____/  \___/  \___||_|\_\ \___| \__|(_)|_| \___/

  **/

  /* Incoming socket data */
  socket.on('update data', function(data) {
      substringMatcher = null;
      addPlayerTypeAhead(data.players);
      addNewGameToQueue(data.queue);
      addNewLeaderboard(data.players);
      addNewCurrentlyPlaying(data.queue[0]);
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
    $('#player1').val('');
    $('#player2').val('');
    $('#player1').focus();

    socket.emit('create game', player1, player2);
  }

  function deleteQueue(gameId) {
    socket.emit('delete game', gameId);
  }

  function completeGame(gameId, winner) {
    socket.emit('complete game', gameId, winner);
  }

  function addNewGameToQueue(queue) {
    var $newQueue = '';
    for (var i = 1; i < queue.length; i++) {
      var $game = ('<div class="well">' +
                      '<div class="row">' +
                          '<div class="col-md-4 col-md-offset-4 text-center">' +
                              '<h4 class="text-center">' + queue[i].player1 + ' vs. ' + queue[i].player2 + '</h4>' +
                          '</div>' +
                          '<div class="col-md-2 col-md-offset-2">' +
                              '<a class="btn btn-danger deleteGame" role="button" id="' + queue[i]._id + '">' +
                                  '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
                              '</a>' +
                          '</div>' +
                      '</div>' +
                  '</div>');
      $newQueue += $game;
    }
    $queue.html($newQueue);
  }

  function addNewLeaderboard(players) {
    var $newTable = '';
    for (var i = 0; i < players.length; i++) {
      var $delta = (players[i].wins - players[i].losses);
      var $position = i + 1;
      var $tableRow = ('<tr scope="row">' +
                           '<td><b>' + $position + '</b></td>' +
                           '<td><b>' + players[i].name + '</td>' +
                           '<td class="text-right"><b>' + players[i].wins + '</b></td>' +
                           '<td class="text-right"><b>' + players[i].losses + '</b></td>' +
                           '<td class="text-right"><b>' + $delta + '</b></td>' +
                           '<td class="text-right"><b>' + players[i].elo + '</b></td>' +
                        '</tr>'
                       );
      $newTable += $tableRow;
    }

    $scoreboard.html($newTable);
  }

  function addNewCurrentlyPlaying(queue) {
    $noonePlaying = (
        '<div class="row text-center">' +
            '<h3> Naebody vs. Naebody<h3>' +
        '</div>' +
        '<div class="row text-center">' +
            '<p> Why not queue? </p>' +
        '</div>'
    );
    if (queue && queue._id) {
      $playing.html(nowPlayingTemplate(queue));
    }else {
      $playing.html($noonePlaying);
    }
  }
  /* Helpers */
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  $window.keydown(function(event) {
      if (event.which === 13) {
        addToQueue();
      }
    });

  function nowPlayingTemplate(queue) {
    return $currentlyPlaying = (
        '<div class="col-md-6 col-md-offset-3 text-center">' +
            '<a id="' + queue._id + '" value="' + queue.player1 + '" type="button" class="btn btn-lg btn-primary completeGame">' +
                queue.player1 +
                '&nbsp;<i class="fa fa-trophy fa-lg fa-fw text-right"></i>&nbsp;' +
            '</a>' +
            '<label><h4>' + '&nbsp;' + 'vs.' + '&nbsp;' + '</h4></label>' +
            '<a id="' + queue._id + '" value="' + queue.player2 + '" type="button" class="btn btn-lg btn-primary completeGame">' +
                '&nbsp;<i class="fa fa-trophy fa-lg fa-fw text-left"></i>&nbsp;' +
                queue.player2 +
            '</a>' +
        '</div>' +
        '<div class="col-md-1 col-md-offset-2">' +
            '<a id="' + queue._id + '" class="btn btn-lg btn-danger deleteGame" role="button">' +
                '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
            '</a>' +
        '</div>'
    );}

  /**

  _                               _                       _       _
 | |                             | |                     | |     (_)
 | |_  _   _  _ __    ___   __ _ | |__    ___   __ _   __| |      _  ___
 | __|| | | || '_ \  / _ \ / _` || '_ \  / _ \ / _` | / _` |     | |/ __|
 | |_ | |_| || |_) ||  __/| (_| || | | ||  __/| (_| || (_| | _   | |\__ \
  \__| \__, || .__/  \___| \__,_||_| |_| \___| \__,_| \__,_|(_)  | ||___/
        __/ || |                                                _/ |
       |___/ |_|                                               |__/

  **/

  function addPlayerTypeAhead(playerData) {
    substringMatcher = null;
    var playerNames = [];
    for (var i in playerData) {
      playerNames.push(playerData[i].name);
    }

    var substringMatcher = function(strs) {
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

    $('#player1').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'playerNames',
      source: substringMatcher(playerNames)
    });

    $('#player2').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'playerNames',
      source: substringMatcher(playerNames)
    });
  }

});
