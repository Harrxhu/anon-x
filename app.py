from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret"

socketio = SocketIO(app)

@app.route("/")
def home():
    return render_template("index.html")

# JOIN ROOM
@socketio.on("join_room")
def join(data):

    username = data["username"]
    room = data["room"]

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

if __name__ == "__main__":
    socketio.run(app, debug=True)