from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time


    
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, manage_session=False)

class Member:
    def __init__(self, socketID, name):
        self.name = name 
        self.socketID  =socketID
        self.currentScore = 0
        self.totalScore = 0

members = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('newMember')
def new_member(socketID, name):
    members[name] = Member(socketID, name)
    membersList = members.values()
    time.sleep(5) 
    emit('updateLeaderBoard', membersList, broadcast=True)




@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on("hostStart")
def start():
    emit('gameStart')



if __name__ == '__main__':
    print("its starting")
    socketio.run(app, port=8080)
