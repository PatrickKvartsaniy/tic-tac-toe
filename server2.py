from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from model import Replay

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = "REALLY SECRET KEY"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://patrick:erasmusmundus@localhost/tictac'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
socket = SocketIO(app)

db = SQLAlchemy(app)

@app.route('/login')
def index():
    return render_template('login.html', latest=Replay.query.limit(3).all())

@app.route('/game')
def game():    
    return render_template('game.html')

@socket.on('message', namespace='/game')
def message(message):
    if message['Type'] == 'gameover':
        try:
            hist = message['history']
            replay = Replay(hist['Info']['Date'], message['size'], hist['Info']['Player1'],
                            hist['Info']['Player2'], message['winner'], str(hist['Turns']))

            db.session.add(replay)
            db.session.commit()
        except Exception:
            print("Can not save data")
    emit('message', message, broadcast=True)


if __name__ == '__main__':
    socket.run(app, port = 5050)