from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
from scoring import calculateScore
import ffmpeg
from blarr import blinding_lights_arr


app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, manage_session=False,)

class Member:
    def __init__(self, name):
        self.name = name 
        self.score = 0
    def toJSON(self):
        return {"name": self.name, "score": self.score}

print("setting members")
members = {}

@app.route('/')
def index():
    print("hitting index")
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    # print(request)
    print("uploading")
    file = request.files['file']
    # clipname = request.form['name']
    index = int(request.form['index'])
    username = request.form['username']

    if (username not in members):
        members[username] = Member(username)


    if (index > 1):
        adjusted = index - 1
        clipname = blinding_lights_arr[adjusted]

        file.save(f'./recs/webm/{clipname}.webm')

        stream = ffmpeg.input(f'./recs/webm/{clipname}.webm')
        stream = ffmpeg.output(stream, f'./recs/wav/{clipname}.wav')
        ffmpeg.run(stream, overwrite_output=True)

        score = calculateScore(f'./recs/wav/{clipname}.wav', f'./clips/{clipname}.wav')
        
        print(score)
        members[username].score += score
        print(username + "'s new score is: " + str(members[username].score))
    

        members_list = list(members.values())
        json_members_list = []
        for member in members_list:
            json_members_list.append(member.toJSON())
        
        socketio.emit('updateLeaderBoard', json_members_list, broadcast=True)

    return "good"


@socketio.on('newMember')
def new_member(sid, name):
    print("new membering")
    print(sid)
    print(name)

    members[name] = Member(name)
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
