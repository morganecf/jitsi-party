# Example usage: python test_db_connection_via_socketio.py 10
# Sends 10 events per second

import sys
import time
import random
import socketio

rooms = ['vestibule', 'closet', 'livingRoom', 'danceParty', 'music', 'bathroom', 'boudoir', 'trashyBedroom', 'bubbleBaths', 'punishmentCloset', 'bunnyRun', 'passageway', 'kitchen', 'corridor', 'mapRoom', 'library', 'gallery', 'cloister', 'gameRoom', 'courtyard', 'bye']

EVENTS_PER_SECOND = int(sys.argv[1])

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

sio.connect('http://localhost:3000')

while True:
    for _ in range(EVENTS_PER_SECOND):
        room = random.choice(rooms)
        sio.emit('enter-room', {
            'user': { 'id': 1 },
            'room': room
        })
    time.sleep(1)

sio.disconnect()
