from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# local_db = 'postgresql://patrick:erasmusmundus@localhost/tictac'
heroku_db = "postgres://adtgejmnvprvxj:e0ad8a40bfba4e77459351bd094ee44c4e70f8651efb917c61dc4ba3cc3f3c59@ec2-54-217-236-201.eu-west-1.compute.amazonaws.com:5432/d5emi4l61scuog" 
app.config['SQLALCHEMY_DATABASE_URI'] = heroku_db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Replay(db.Model): 
    __tablename__ = "replays"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    player1 = db.Column(db.String(50), nullable=False)
    player2 = db.Column(db.String(50), nullable=False)
    winner = db.Column(db.String(50), nullable=False)
    history = db.Column(db.ARRAY(db.Integer), nullable=False)

    def __init__(self,date,size,player1,player2,winner,history):
        self.date = date
        self.size = size
        self.player1 = player1
        self.player2 = player2
        self.winner = winner
        self.history = history