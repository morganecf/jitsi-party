FROM python:3.7.7-stretch


RUN apt-get update && apt-get install -y libpq-dev

ADD requirements /requirements
RUN pip install --upgrade pip && pip install -r /requirements/prod.txt

ADD . /app
WORKDIR /app

CMD ["./start.sh"]
