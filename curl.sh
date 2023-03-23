#!/bin/bash

curl -f 'http://localhost:5000/' -X POST -H 'content-type: application/json' -d '{"query": "{ listUsers { name } }"}'