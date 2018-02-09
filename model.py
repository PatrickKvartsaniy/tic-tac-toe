from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)

class Replay(db.Model):
    __tablename__ = "replays"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    player1 = db.Column(db.String(50), nullable=False)
    player2 = db.Column(db.String(50), nullable=False)
    winner = db.Column(db.String(50), nullable=False)
    history = db.Column(db.String(150), nullable=False)

    def __init__(self,date,size,player1,player2,winner,history):
        self.date = date
        self.size = size
        self.player1 = player1
        self.player2 = player2
        self.winner = winner
        self.history = history