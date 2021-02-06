#!/bin/bash

PORT=9000
NAME=nodejs-server
docker build -t $NAME .
docker run --restart always --name $NAME -p $PORT:8080 -d $NAME