from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS

    
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, manage_session=False)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('newMember')
def new_member(sid, data):
	print("new member!")
	print(sid)
	print(data)

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
    socketio.run(app, port=8080)
