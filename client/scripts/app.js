var app = {
  server: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages', 
};
app.init = function() {};
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
    success: function(response) {
      //response is a parsed object
      //use the attributes in this to do stuff
      //console.log(response);
      for (var message of response.results) {
        //will have a username, roomname, and text attributes

        var html = '<div class="chat"><p class="username">' + message.username + '</p><p>' + message.text + '</p></div>';
        
        $('#chats').prepend(html);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get messages', data);
    }
  }); 
};
app.clearMessages = () => {
  $('#chats').children().remove();
};
app.renderMessage = () => {
  
};
/*
$('#message_form').submit(function(){
  $('#selected_room').val();
  $('#message_text').val();
});
*/

$(document).ready(function() {
  $('#submit').click(function() {
    app.send($('#submit').val);
  });
  $('#update').click(function() {
    app.fetch();
  });
  $('#clear').click(function() {
    app.clearMessages();
  });
});
