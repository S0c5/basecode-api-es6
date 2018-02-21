#!/usr/bin/env bash
mocha --compilers js:babel-register $1 --recursive --timeout 100000 --require ./test/_.js