/* ================= SOCKET ================= */

const socket = io();

let username = "";
let room = "";

/* JOIN ROOM */

function joinRoom(){

    username = document.getElementById("username").value;

    room = document.getElementById("room").value;

    if(username === "" || room === ""){

        alert("Enter Username And Room Code");

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

    appendMessage(username, message, true);

    input.value = "";
}

/* RECEIVE MESSAGE */

socket.on("receive_message", (data)=>{

    if(data.username !== username){

        appendMessage(
            data.username,
            data.message,
            false
        );
    }
});

/* USER JOINED */

socket.on("user_joined", (data)=>{

    appendMessage(
        "SYSTEM",
        data.username + " connected",
        false
    );
});

/* APPEND MESSAGE */

function appendMessage(username, message, mine=false){

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    div.classList.add("msg");

    if(mine){

        div.classList.add("you");

    }else{

        div.classList.add("other");
    }

    div.innerHTML = `
        <b>${username}</b>
        ${message}
    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
}

/* ENTER KEY */

document.addEventListener("keypress", (e)=>{

    if(e.key === "Enter"){

        sendMessage();
    }
});

/* CLEAR CHAT */

function clearChat(){

    document.getElementById("messages").innerHTML = "";
}