from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = "REALLY SECRET KEY"
socket = SocketIO(app)

@app.route('/login')
def index():
    return render_template('login.html')

@app.route('/game')
def game():    
    return render_template('game.html')

@socket.on('message', namespace='/game')
def message(message):
    print(f"message {message}")
    emit('message', message, broadcast=True)

# @socket.on('connect', namespace='/chat')
# def test_connect():
#     emit('my response', {'data': 'Connected', 'count': 0})


if __name__ == '__main__':
    socket.run(app, port = 8000)