#!/bin/bash

while true
  do
    ab -n 200 -c 20 http://arch.homework/user/1;
    sleep 3;
  done