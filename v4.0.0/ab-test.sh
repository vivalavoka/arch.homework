#!/bin/bash

ab -n 500 -c 2 http://$GATEWAY_URL/health 