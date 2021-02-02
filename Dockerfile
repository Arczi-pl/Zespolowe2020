FROM python:alpine3.7

COPY ./Zespolowe2020-main/Projekt /app
WORKDIR /app


RUN apk add --update --no-cache --virtual .tmp gcc libc-dev linux-headers py-cryptography python3-dev libffi-dev openssl-dev musl-dev
RUN /usr/local/bin/python -m pip install --upgrade pip


COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt 



ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV SQL_URL=mysql+pymysql://aplikacja:Aplikacja123@host.docker.internal:3306/aplikacja


EXPOSE 8080 
CMD [ "python", "main.py" ]
