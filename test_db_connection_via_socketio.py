# Example usage: test_db_connection_via_socketio.py 10 5
# Runs it 10x (10s), sending 5 events from this client per second, so 50 events total

import sys
import time
import socketio

NUM_ITERATIONS = int(sys.argv[1])
EVENTS_PER_SECOND = int(sys.argv[2])

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

sio.connect('http://localhost:3000')

for _ in range(NUM_ITERATIONS):
    for _ in range(EVENTS_PER_SECOND):
        sio.emit('enter-room', {
            'user': { 'id': 1 },
            'room': 'vestibule'
        })
    time.sleep(1)

sio.disconnect()