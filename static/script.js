const socket = io();

let username = "";
let room = "";

// JOIN ROOM

function joinRoom(){

    username = document
    .getElementById("username")
    .value
    .trim();

    room = document
    .getElementById("room")
    .value
    .trim();

    if(username === "" || room === ""){

        alert("ENTER USERNAME & ROOM");

        return;
    }

    socket.emit("join_room", {

        username: username,
        room: room

    });

    document
    .getElementById("connect-page")
    .style.display = "none";

    document
    .getElementById("chat-page")
    .style.display = "block";

    document
    .getElementById("room-name")
    .innerText = room;
}

// SEND MESSAGE

function sendMessage(){

    let input = document
    .getElementById("messageInput");

    let message = input.value.trim();

    if(message === "") return;

    socket.emit("send_message", {

        username: username,
        room: room,
        message: message

    });

    input.value = "";
}

// RECEIVE MESSAGE

socket.on("receive_message", function(data){

    let messages = document
    .getElementById("messages");

    let myMessage = data.username === username;

    messages.innerHTML += `

    <div class="message ${myMessage ? "" : "left"}">

        <div class="message-user">
            ${data.username}
        </div>

        <div class="message-text">
            ${data.message}
        </div>

    </div>

    `;

    messages.scrollTop = messages.scrollHeight;
});

// CLEAR CHAT

function clearChat(){

    document
    .getElementById("messages")
    .innerHTML = "";
}

// ENTER KEY SUPPORT

document.addEventListener("DOMContentLoaded", () => {

    const usernameInput = document
    .getElementById("username");

    const roomInput = document
    .getElementById("room");

    const messageInput = document
    .getElementById("messageInput");

    // USERNAME -> ROOM

    usernameInput.addEventListener("keypress", function(e){

        if(e.key === "Enter"){

            roomInput.focus();

        }

    });

    // ROOM -> CONNECT

    roomInput.addEventListener("keypress", function(e){

        if(e.key === "Enter"){

            joinRoom();

        }

    });

    // MESSAGE -> SEND

    messageInput.addEventListener("keypress", function(e){

        if(e.key === "Enter"){

            sendMessage();

        }

    });

});