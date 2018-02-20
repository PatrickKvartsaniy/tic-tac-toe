from flask import Flask, render_template, url_for, redirect
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from model import Replay
import os

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = "REALLY SECRET KEY"

local_db = 'postgresql://patrick:erasmusmundus@localhost/tictac'
heroku_db = "postgres://adtgejmnvprvxj:e0ad8a40bfba4e77459351bd094ee44c4e70f8651efb917c61dc4ba3cc3f3c59@ec2-54-217-236-201.eu-west-1.compute.amazonaws.com:5432/d5emi4l61scuog" 

app.config['SQLALCHEMY_DATABASE_URI'] = heroku_db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

socket = SocketIO(app)
db = SQLAlchemy(app)
api = Api(app)


# class ReplaysApi(Resource):
#     def get(self):
#         data = [vars(game) for game in Replay.query.limit(3).all()]
#         for game in data:
#             del game['_sa_instance_state']
#         return data

# api.add_resource(ReplaysApi,'/api')

db.create_all()

@app.route('/')
def index():
    return redirect('/login')


@app.route('/login')
def login():
    return render_template('login.html')
    # latest = Replay.query.limit(3).all())

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
    port = int(os.environ.get('PORT', 5000))
    print(f"Serve on port: {port}")
    socket.run(app,host="0.0.0.0",port=port)
