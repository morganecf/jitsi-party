'''
Running app
    celery -A celery_test worker --loglevel=info
Running scheduler
    celery -A celery_test beat
'''

import time
from celery import Celery
from jitsi.models import User

app = Celery('tasks', broker='amqp://localhost')

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds
    sender.add_periodic_task(10, test.s('hello'), name='say hello every 2s')

    # Calls test('world') every 20 seconds
    sender.add_periodic_task(10, test.s('world'), expires=10)


@app.task
def add(x, y):
    return x + y

@app.task
def test(arg):
    users = User.get_active_users_by_room()
    f = open(str(time.time()), 'w')
    f.write(str(len(users)))
    f.close()
    print(arg, len(users))
