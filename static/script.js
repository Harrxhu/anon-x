const socket = io();

let username = "";
let room = "";

/* JOIN ROOM */

function joinRoom(){

    username = document.getElementById("username").value;

    room = document.getElementById("room").value;

    if(username === "" || room === ""){
        alert("Enter Username & Room");
        return;
    }

    socket.emit("join_room", {
        username: username,
        room: room
    });

    document.getElementById("connect-page").style.display = "none";

    document.getElementById("chat-page").style.display = "block";

    document.getElementById("room-name").innerText = room;
}

/* SEND MESSAGE */

function sendMessage(){

    const input = document.getElementById("messageInput");

    const message = input.value;

    if(message.trim() === ""){
        return;
    }

    socket.emit("send_message", {
        username: username,
        room: room,
        message: message
    });

    addMessage(username, message, true);

    input.value = "";
}

/* RECEIVE MESSAGE */

socket.on("receive_message", (data) => {

    if(data.username !== username){

        addMessage(data.username, data.message, false);

    }

});

/* ADD MESSAGE */

function addMessage(sender, text, isMe){

    const messages = document.getElementById("messages");

    const msg = document.createElement("div");

    msg.classList.add("message");

    if(isMe){

        msg.classList.add("me");

    }else{

        msg.classList.add("other");
    }

    msg.innerHTML = `
        <div class="username">${sender}</div>
        <div class="msgtext">${text}</div>
    `;

    messages.appendChild(msg);

    messages.scrollTop = messages.scrollHeight;
}

/* CLEAR CHAT */

function clearChat(){

    document.getElementById("messages").innerHTML = "";
}