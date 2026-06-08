const socket = io();

let username = "";
let room = "";

/* JOIN ROOM */

function joinRoom() {

    username = document.getElementById("username").value.trim();
    room = document.getElementById("room").value.trim();

    if (!username || !room) {
        alert("Enter Codename & Channel ID");
        return;
    }

    const btn = document.querySelector(".connect-btn");

    if (btn) {
        btn.innerText = "ESTABLISHING LINK...";
        btn.disabled = true;
    }

    setTimeout(() => {

        socket.emit("join_room", {
            username,
            room
        });

        document.getElementById("connect-page").style.display = "none";
        document.getElementById("chat-page").style.display = "block";

        document.getElementById("room-name").innerText = room;

        if (document.getElementById("messageInput")) {
            document.getElementById("messageInput").focus();
        }

        scrollBottom();

    }, 1200);
}

/* SEND MESSAGE */

function sendMessage() {

    const input = document.getElementById("messageInput");

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    socket.emit("send_message", {
        username,
        room,
        message
    });

    addMessage(username, message, true);

    input.value = "";

    scrollBottom();
}

/* RECEIVE MESSAGE */

socket.on("receive_message", (data) => {

    if (data.username !== username) {

        addMessage(
            data.username,
            data.message,
            false
        );
    }
});

/* ADD MESSAGE */

function addMessage(sender, text, isMe) {

    const messages = document.getElementById("messages");

    if (!messages) return;

    const msg = document.createElement("div");

    msg.classList.add("message");

    msg.classList.add(
        isMe ? "me" : "other"
    );

    const now = new Date();

    const time =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

    msg.innerHTML = `
        <div class="username">${escapeHtml(sender)}</div>
        <div class="msgtext">${escapeHtml(text)}</div>
        <div class="msgtime">${time}</div>
    `;

    messages.appendChild(msg);

    scrollBottom();
}

/* CLEAR CHAT */

function clearChat() {

    const messages =
        document.getElementById("messages");

    if (messages) {
        messages.innerHTML = "";
    }
}

/* ENTER TO JOIN */

const roomInput =
    document.getElementById("room");

if (roomInput) {

    roomInput.addEventListener(
        "keypress",
        function (e) {

            if (e.key === "Enter") {
                joinRoom();
            }
        }
    );
}

/* ENTER TO SEND */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const msgInput =
            document.getElementById("messageInput");

        if (!msgInput) return;

        msgInput.addEventListener(
            "keypress",
            function (e) {

                if (e.key === "Enter") {
                    sendMessage();
                }
            }
        );
    }
);

/* AUTO SCROLL */

function scrollBottom() {

    const box =
        document.getElementById("messages");

    if (!box) return;

    setTimeout(() => {

        box.scrollTop =
            box.scrollHeight;

    }, 50);
}

/* ESCAPE HTML */

function escapeHtml(str) {

    const div =
        document.createElement("div");

    div.innerText = str;

    return div.innerHTML;
}

/* FAKE TERMINAL BOOT EFFECT */

window.addEventListener(
    "load",
    () => {

        const classified =
            document.querySelector(".classified");

        if (!classified) return;

        const original =
            classified.innerText;

        classified.innerText =
            "INITIALIZING SECURE SYSTEM...";

        setTimeout(() => {
            classified.innerText =
                "AUTHENTICATING NODE...";
        }, 800);

        setTimeout(() => {
            classified.innerText =
                original;
        }, 1800);
    }
);