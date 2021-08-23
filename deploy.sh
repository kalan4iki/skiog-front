#!/bin/bash

frontend_path='/home/vadim/skiog-back/docker/front/'
delete_path='/home/vadim/skiog-back/docker/front/*'
build_path='/home/vadim/skiog-front/dist/spa/*'

if [ -d "dist" ]
then
  rm -R dist/*
fi

if [ -d "node_modules"]
then
  npm install
fi
quasar build
rm -R $delete_path
cp -R $build_path $frontend_path