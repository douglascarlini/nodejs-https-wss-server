#!/bin/bash

# VARS
PORT=$1
CONTAINER=$2
IMAGE=nodejs-https-wss

# BUILD IMAGE
docker build -t $IMAGE .

# STOP AND REMOVE OLD RUNNING CONTAINERS
{ docker stop $CONTAINER; } || { echo ""; }
{ docker rm $CONTAINER; } || { echo ""; }

# RUN IMAGE ON CONTAINER
docker run --name $CONTAINER --restart always -p $PORT:80 -d $IMAGE
