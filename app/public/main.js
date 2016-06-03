$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms

  // Initialize variables
  var $window = $(window);
  var $player1 = $('.player1'); // Input for username
  var $player2 = $('.player2');
  var $queue = $('.queue');
  var $scoreboard = $('.scoreboard');
  var $usernameInput = $('.usernameInput');
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  socket.on('create game', function(data) {
      addGameToQueue(data.game);
      updateTable(data.players);
    });

  $(document).ready(function() {
    $('#createGame').click(function() {
        socket.emit('create game', cleanInput($('#player1').val()), cleanInput($('#player2').val()));
      });
  });

  function addGameToQueue(game) {
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

  function updateTable(players) {
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

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += 'there\'s 1 participant';
    } else {
      message += 'there are ' + data.numUsers + ' participants';
    }
    log(message);
  }

  // Sets the client's username
  function setUsername() {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function createGame() {
    var player1 = cleanInput($player1.val());
    var player2 = cleanInput($player2.val());
    // if there is a non-empty message and a socket connection
    if (player1 && player2 && connected) {
      addChatMessage({
        player1: player1,
        player2: player2
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('create game', player1, player2);
    }
  }

  // Log a message
  function log(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage(data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>').text(data.username).css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">').text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping(data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(function() {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement(el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages(data) {
    return $('.typing.message').filter(function(i) {
      return $(this).data('username') === data.username;
    });
  }

  // Keyboard events

  $window.keydown(function(event) {
      console.log('keypress');
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      }
    });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function() {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function() {
    $inputMessage.focus();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function(data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function(data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function(data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function(data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function(data) {
    removeChatTyping(data);
  });
});
