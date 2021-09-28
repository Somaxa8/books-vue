#!/usr/bin/env bash

rm -rf dist
npm run build
ssh root@books.somacode.app rm -rf /root/nginx/html/index/*
scp -r dist/* root@books.somacode.app:/root/nginx/html/index
