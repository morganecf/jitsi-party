FROM tiangolo/uwsgi-nginx-flask:python3.7

COPY ./app /app
COPY uwsgi.ini /app/
ADD requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

