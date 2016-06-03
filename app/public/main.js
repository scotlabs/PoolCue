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
    console.log('here')
      addNewGameToQueue(data.game);
    });

  socket.on('update leaderboard', function(data) {
      addNewLeaderboard(data.players);
  });

  socket.on('update data', function(data) {
    addNewGameToQueue(data.queue);
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
    var player1 = cleanInput($('#player1').val());
    var player2 = cleanInput($('#player2').val());

    socket.emit('create game', player1, player2);
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
                              '<a class="btn btn-danger" role="button" id="' + queue[i]._id + '">' +
                                  '<i class="fa fa-close fa-fw" aria-hidden="true"></i>' +
                              '</a>' +
                          '</div>' +
                      '</div>' +
                  '</div>');
        $newQueue += $game;
        //console.log($game)
      }
    //  console.log($newQueue)
    $queue.html($newQueue);
  }

  function addNewLeaderboard(players) {
    var $newTable = '';
    for (var i = 0; i < players.length; i++) {
      var $delta = (players[i].wins - players[i].losses);
      var $position = i+1;
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
