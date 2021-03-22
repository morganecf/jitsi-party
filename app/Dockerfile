FROM python:3.7.7-stretch


RUN apt-get update && apt-get install -y libpq-dev

ADD . /app
WORKDIR /app
RUN pip install --upgrade pip && pip install -r requirements/prod.txt

CMD ["./start.sh"]
