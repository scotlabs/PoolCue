$(function() {
  // Initialize variables
  var $window = $(window);
  var $playing = $('.playing');
  var $queue = $('.queue');
  var $scoreboard = $('.scoreboard');

  var socket = io();

  /* Incoming socket data */
  socket.on('update data', function(data) {
    addNewGameToQueue(data.queue);
    addNewLeaderboard(data.players);
    addNewCurrentlyPlaying(data.queue[0]);
  });

  /* Button clicks */
  $(document).ready(function() {
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
});
