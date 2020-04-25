FROM tiangolo/meinheld-gunicorn-flask:python3.7

COPY ./app /app

ENV MODULE_NAME app
