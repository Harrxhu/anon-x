const socket = io();

let username = "";
let room = "";

/* JOIN ROOM */

function joinRoom(){

    username = document
        .getElementById("username")
        .value
        .trim();

    room = document
        .getElementById("room")
        .value
        .trim();

    if(!username || !room){

        alert("Enter Codename & Channel ID");
        return;
    }

    const btn =
        document.querySelector(".connect-btn");

    btn.innerText = "CONNECTING...";

    btn.disabled = true;

    setTimeout(()=>{

        socket.emit("join_room",{

            username:username,
            room:room

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

        document
            .getElementById("messageInput")
            .focus();

    },1000);

}

/* SEND */

function sendMessage(){

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if(message === "") return;

    socket.emit("send_message",{

        username:username,
        room:room,
        message:message

    });

    addMessage(
        username,
        message,
        true
    );

    input.value = "";

}

/* RECEIVE */

socket.on(
    "receive_message",
    (data)=>{

        if(data.username !== username){

            addMessage(
                data.username,
                data.message,
                false
            );

        }

    }
);

/* ADD MESSAGE */

function addMessage(
    sender,
    text,
    isMe
){

    const messages =
        document.getElementById("messages");

    const msg =
        document.createElement("div");

    msg.classList.add("message");

    msg.classList.add(
        isMe ? "me" : "other"
    );

    const now = new Date();

    const time =
        now.getHours()
        .toString()
        .padStart(2,"0")

        +

        ":"

        +

        now.getMinutes()
        .toString()
        .padStart(2,"0");

    msg.innerHTML =

    `
    <div class="username">
        ${escapeHtml(sender)}
    </div>

    <div class="msgtext">
        ${escapeHtml(text)}
    </div>

    <div class="msgtime">
        ${time}
    </div>
    `;

    messages.appendChild(msg);

    scrollBottom();

}

/* CLEAR */

function clearChat(){

    document
        .getElementById("messages")
        .innerHTML = "";

}

/* ENTER JOIN */

document
.getElementById("room")
.addEventListener(

    "keypress",

    function(e){

        if(e.key === "Enter"){

            joinRoom();

        }

    }

);

/* ENTER SEND */

document.addEventListener(

"DOMContentLoaded",

()=>{

    const input =
    document.getElementById(
        "messageInput"
    );

    if(!input) return;

    input.addEventListener(

        "keypress",

        function(e){

            if(e.key === "Enter"){

                sendMessage();

            }

        }

    );

}

);

/* SCROLL */

function scrollBottom(){

    const box =
        document.getElementById(
            "messages"
        );

    if(!box) return;

    setTimeout(()=>{

        box.scrollTop =
        box.scrollHeight;

    },50);

}

/* SAFE HTML */

function escapeHtml(text){

    const div =
        document.createElement("div");

    div.innerText = text;

    return div.innerHTML;

}