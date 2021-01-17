from flask_socketio import SocketIO, emit
from flask import Flask
from flask_cors import CORS
from random import random
from threading import Thread, Event
from time import sleep

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
CORS(app)

# Handle the webapp connecting to the websocket
@socketio.on('connect')
def test_connect():
    print('someone connected to websocket')
    # emit('responseMessage', {'data': 'Connected! ayy'})
    # # need visibility of the global thread object
    # global thread
    # if not thread.isAlive():
    #     print("Starting Thread")
    #     thread = DataThread()
    #     thread.start()


# Handle the webapp sending a message to the websocket, including namespace for testing
@socketio.on("newMember")
def handle_message2():
    print('someone sent to the websocket!')



if __name__ == '__main__':
    # socketio.run(app, debug=False, host='0.0.0.0')
    print("we are running on 8080 ")
    http_server = WSGIServer(('',8080), app, handler_class=WebSocketHandler)
    http_server.serve_forever()