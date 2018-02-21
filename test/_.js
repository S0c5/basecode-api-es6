import mongoose from 'mongoose';
import supertest from 'supertest-as-promised';
import app from '../bootstrap';

require('should');

const request = supertest(app.server());


mongoose.Promise = Promise;
global.config = app.config;
global.request = request;
global.supertest = supertest;
global._ = require('underscore');
global.Q = require('q');
global.db = require('./utils/db');
