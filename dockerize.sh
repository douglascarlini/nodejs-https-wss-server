#!/bin/bash

PORT=9000
NAME=nodejs-server
docker build -t $NAME .
docker container stop $NAME && docker container rm $NAME
docker run --restart always --name $NAME -p $PORT:8080 -d $NAME