from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time


    
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, manage_session=False)

class Member:
    def __init__(self, sid, name):
        self.name = name 
        self.sid = sid
        self.current_score = 0
        self.total_score = 0
    def toJSON(self):
        return {"name": self.name, "socketID": self.sid, "currentScore": self.current_score, "totalScore": self.total_score}

members = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('newMember')
def new_member(sid, name):
    print("new membering")
    print(sid)
    print(name)

    members[name] = Member(sid, name)
    members_list = list(members.values())
    json_members_list = []
    for member in members_list:
        json_members_list.append(member.toJSON())

    time.sleep(5)  
    print("updating leaderboard")

    emit('updateLeaderBoard', json_members_list, broadcast=True)




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
