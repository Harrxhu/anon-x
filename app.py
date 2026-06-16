from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

socketio = SocketIO(app)

# CONNECTED USERS
users = {}

@app.route("/")
def home():
    return render_template("index.html")


# JOIN ROOM

@socketio.on("join_room")
def join(data):

    username = data["username"]
    room = data["room"]

    users[request.sid] = {
        "username": username,
        "room": room
    }

    join_room(room)

    emit(
        "receive_message",
        {
            "username": "SYSTEM",
            "message": f"{username} connected"
        },
        room=room
    )


# SEND MESSAGE

@socketio.on("send_message")
def message(data):

    emit(
        "receive_message",
        {
            "username": data["username"],
            "message": data["message"]
        },
        room=data["room"]
    )


# USER DISCONNECTED

@socketio.on("disconnect")
def disconnect_user():

    if request.sid in users:

        username = users[request.sid]["username"]
        room = users[request.sid]["room"]

        emit(
            "receive_message",
            {
                "username": "SYSTEM",
                "message": f"{username} disconnected"
            },
            room=room
        )

        del users[request.sid]


# WEBRTC OFFER

@socketio.on("offer")
def offer(data):

    emit(
        "offer",
        data,
        room=data["room"],
        include_self=False
    )


# WEBRTC ANSWER

@socketio.on("answer")
def answer(data):

    emit(
        "answer",
        data,
        room=data["room"],
        include_self=False
    )


# ICE CANDIDATE

@socketio.on("ice_candidate")
def ice_candidate(data):

    emit(
        "ice_candidate",
        data,
        room=data["room"],
        include_self=False
    )


if __name__ == "__main__":

    import os

    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port
    )