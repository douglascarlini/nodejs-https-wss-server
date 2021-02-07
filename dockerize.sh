#!/bin/bash

PORT=$1
NAME=nodejs-server
docker build -t $NAME .
docker run --restart always -p $PORT:8080 -d $NAME