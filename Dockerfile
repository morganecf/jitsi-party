FROM python:3.7.7-stretch

CMD ["./start.sh"]
WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev

ADD start.sh .

ADD requirements ./requirements
RUN pip install --upgrade pip && pip install -r requirements/prod.txt

COPY ./app /app
