from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from model import Replay

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = "REALLY SECRET KEY"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://patrick:erasmusmundus@localhost/tictac'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

socket = SocketIO(app)
db = SQLAlchemy(app)
api = Api(app)


class ReplaysApi(Resource):
    def get(self):
        data = [vars(game) for game in Replay.query.limit(3).all()]
        for game in data:
            del game['_sa_instance_state']
        return data

api.add_resource(ReplaysApi,'/api')

db.create_all()

@app.route('/login')
def index():
    return render_template('login.html', latest = Replay.query.limit(3).all())

@app.route('/game')
def game():    
    return render_template('game.html')

@socket.on('message', namespace='/game')
def message(message):
    if message['Type'] == 'gameover':
        hist = message['history']
        replay = Replay(hist['Info']['Date'], hist['Info']['size'], hist['Info']['Player1'],
                        hist['Info']['Player2'], message['winner'], hist['Turns'])
        db.session.add(replay)
        db.session.commit()
        print(message['history'])
    emit('message', message, broadcast=True)


if __name__ == '__main__':
    socket.run(app,host='0.0.0.0',port=5000)
    