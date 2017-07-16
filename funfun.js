
  var socket = io();

  $('form').submit(function(e){
    const messageText = $('#m').val()
    const user = $('#user-selection').val()

    if(!$('#username').text()){
      alert("please log in to send messages")
      return false
    }

    if(!messageText){
      alert("maybe when you send a message, insert a message next time silly bear")
      return false
    }

    if(user==$('#username').text()){
      alert("Send a message to yourself? I think not... if someone has your username already, simply change it and submit please")
      return
    }
      if(user && user!==$('#login').val()){
        const payload = {user,message:messageText}
        socket.emit('private', payload)
      }else{

    socket.emit('chat message', messageText);
    $('#m').val('');
  }
    return false;
  });

$('#login-btn').on('click',() => {
  const username = $('#login').val()
  if(username){
    socket.emit('login', username)
    $('#username').text(username)
    $('#login').val("")
  }else{
    alert("please login please to send messages")
  }
})

socket.on('private message', (msg) => {
  console.log(msg,"MESSAGE FROM CL")
  $('#messages').append($('<li>').text(msg));
  window.scrollTo(0, document.body.scrollHeight);
})


  socket.on('userlist', (msg) => {
    $('#user-list').empty()
    Object.keys(msg).forEach(user => {
      $('#user-list').append(`<li class="users">${msg[user]}</li>`)
    })
  })


  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('userConnection', (msg) => {
    console.log(msg,"update user list");
      $('#user-total').empty()
    $('#user-total').append($('<h6>').text("Total connected: "+msg))
  })

  socket.on('typing', (msg) =>{
    const users = $('.users')
    Object.keys(users).forEach(user => {
      if(msg==users[user].innerHTML){
        const orginal = users[user].innerHTML
        users[user].innerHTML= users[user].innerHTML+" is typing..."
        setTimeout(()=>{users[user].innerHTML=orginal },2000)
      }
    })
  })

  socket.on('errors', () => {
    alert("No user by that name")
  })

  $('#m').keyup(() => {
    socket.emit('user typing')
  })
