$(function() {
  // Initialize variables
  var $window = $(window);
  var $player1 = $('.player1'); // Input for username
  var $player2 = $('.player2');
  var $queue = $('.queue');
  var $scoreboard = $('.scoreboard');

  var socket = io();

  /* Incoming socket data */
  socket.on('create game', function(data) {
      addNewGameToQueue(data.game);
    });

  socket.on('update leaderboard', function(data) {
      addNewLeaderboard(data.players);
  });

  /* Button clicks */
  $(document).ready(function() {
    $('#createGame').click(function() {
        updateQueue();
      });
  });


  function updateLeaderboard(){
    socket.emit('update leaderboard');
  }

  function updateQueue(){
    socket.emit('create game', cleanInput($('#player1').val()), cleanInput($('#player2').val()));
  }

  function addNewGameToQueue(game) {
    var $game = $('<div class="well">' +
                    '<div class="row">' +
                        '<div class="col-md-4 col-md-offset-4 text-center">' +
                            '<h4 class="text-center">' + game.player1 + ' vs. ' + game.player2 + '</h4>' +
                        '</div>' +
                        '<div class="col-md-2 col-md-offset-2">' +
                            '<a class="btn btn-danger" role="button" id="' + game._id + '">' +
                                '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>');

    $queue.append($game);
  }

  function addNewLeaderboard(players) {
    var $newTable = '';
    for (var i = 0; i < players.length; i++) {
      var $tableRow = ('<tr scope="row" />' +
                           '<td><b>' + (i + 1) + '</b></td>' +
                           '<td><b>' + players[i].name + '</td>' +
                           '<td class="text-right"><b>' + players[i].wins + '</b></td>' +
                           '<td class="text-right"><b>' + players[i].losses + '</b></td>' +
                           '<td class="text-right"><b>' + players[i].wins - players[i].losses + '</b></td>' +
                           '<td class="text-right"><b>' + players[i].elo + '</b></td>' +
                        '</tr>'
                       );
      $newTable = $tableRow;

      if (i == players.length - 1) {
        $scoreboard = $newTable;
      }
    }
  }

 /* Helpers */
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  $window.keydown(function(event) {
      if (event.which === 13) {
        updateQueue();
      }
    });

});
