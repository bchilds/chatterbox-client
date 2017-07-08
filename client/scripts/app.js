var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
  //response: undefined, 
};
app.init = function() {
  //$('#roomSelect').children().remove();
  //app.clearMessages();
};
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  }); 
};
app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: { order: '-updatedAt' },
    success: function(response) {
      //response is a parsed object
      //use the attributes in this to do stuff
      //console.log(response);
      for (var message of response.results) {
        app.renderMessage(message);
      }
      app.filterMessages($('#roomSelect:first-child').val());
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get messages', data);
    }
  }); 
};
app.clearMessages = () => {
  $('#chats').children().remove();
  $('#roomSelect').children().remove();
};

app.renderMessage = (message) => {
  //takes in a message and pushes it to the DOM

  //will have a username, roomname, and text attributes
  // var $messageText = message.text;
  // var $messageUser = message.username;
  var $node = $('<div class="chat"></div>');
  var $username = $('<p class="username"></p>');
  var $message = $('<p class="user_message"></p>');
  //possibly sanitize room name and username?
  /*$node.data = {
    roomname: message.roomname,
  };*/
  $node.data( 'roomname', message.roomname );
  
  $username.text(message.username);
  $message.text(message.text);
  $node.append($username);  
  $node.append($message);
  $('#chats').prepend($node);
  app.renderRoom(message.roomname);
  
};

app.renderRoom = function(message) {
  var $options = $('option');
  var found = false; 

  if (message && $options.length > 0) {

    //for (var option of $options) {
    for (var i = 0; i < $options.length; i++) {  
      if ($options[i].value === message) {
        found = true; 
      }
    }
  }
  if (!found) {
    
    var $room = $('<option></option>');
    $room.attr({value: message, id: message});
    $room.text(message);
    $('#roomSelect').append($room);
  }
};

app.filterMessages = function(option) {
  //takes in an option
  //hide all messages
  
  $('.chat').hide();
  //$('.chat[data-roomname= "' + option + '"]').show(); 
  $('.chat').each(function() {
    if ($(this).data('roomname') === option) {
      $(this).show();
    }
    
  });
  //show messages that have a roomname matching the option data
};

app.handleSubmit = function() {
  var message = {
    username: window.location.search.slice(10),
    text: $('#message').val(),
    roomname: $('#new_room').val() || $('#roomSelect:first-child').val()
  };
  
  app.send(message);
  app.fetch();
  
};

app.handleUsernameClick = function() {
  // $(document).on('click', '.chat .username', function() {
  // //console.log($(this));
  //   var name = $(this).text();
  //   $('.chat .username').each(function(index) {
  //     if ( $(this).text() === name ) {
  //       $(this).toggleClass('friend');
  //     }
  //   });
  // });
};

$(document).ready(function() {
  $(document).on('click', '.chat', function() {
    //console.log($(this));
    var name = $(this).find('.username').text();
    $('.chat').each(function(index) {
      if ( $(this).find('.username').text() === name ) {
        $(this).toggleClass('friend');
        if ($(this).hasClass('friend')) {
        //  $(this).find('.user_message').css('font-weight', 800);
        } else {
         // $(this).find('.user_message').css('font-weight', 400);
        }
      }
    });
  });
  
  $('#send').click(function() {
    app.handleSubmit();
  });
  $('#update').click(function() {
    app.fetch();
  });
  $('#clear').click(function() {
    app.clearMessages();
  });
  $('#roomSelect').change(function() {
    app.filterMessages($(this).val());
  });
  
  
  //when roomSelect is selected 
    //show appropriate messages
});
