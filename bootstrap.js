import express from 'express';
import debug from 'debug';
import mongoose from 'mongoose';
import requireAll from 'require-all';
import Q from 'q';
import * as web from 'express-decorators';
import passport from 'passport';
import cors from 'cors';
import APIError from './utils/error';
import RedisClient from './app/services/redis';
import bodyParser from 'body-parser';


require('babel-polyfill');

class API {
  constructor(port) {
    this.port = port || process.env.PORT || 3000;
    this.express = express();
    this.loadConfig();
    this.middleware();
    this.setHandler();
    this.controllers();
    this.database();
  }
  loadConfig() {
    this.config = API.config;
  }

  static success(req, res) {
    return (data) => {
      let answer = data;
      if (req.query.envelope) {
        answer = {
          data,
        };
      }
      res
        .status(200)
        .json(answer);
    };
  }

  static error(req, res) {
    return (error) => {
      debug('response:error')(error);
      const response = {
        error: error.message,
      };

      res.status(error.status || 500)
        .json(response);
    };
  }

  middleware() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.express.use(passport.initialize());
    this.express.use(cors());
    // defined wrappers for success and error responses
    this.express.use((req, res, next) => {
      res.success = API.success(req, res);
      res.error = API.error(req, res);
      next();
    });
  }

  setHandler() {
    const methods = 'get,post,put,del,patch,options';

    methods
      .split(',')
      .map((_method) => {
        const _tmp = this.express[_method];
        this.express[_method] = (path, ...methods) => {
          const handler = _fn => (req, res, next) => {
            const handleError = (err) => {
              API.error(req, res)(err);
            };

            try {
              const ret = _fn(req, res, next);
              if (ret && ret.catch) {
                ret.catch(handleError);
              }
            } catch (err) {
              handleError(err);
            }
          };
          methods = methods.map(_fn => handler(_fn));
          _tmp.apply(this.express, [path, ...methods]);
        };
      });
  }

  controllers() {
    const modules = requireAll(`${__dirname}/app/controllers`);
    Object.keys(modules)
      .map(k => modules[k])
      .map((_val) => {
        const n = new _val();
        if (n.custom) {
          return this.express.use(n.router);
        }
        return web.register(this.express, n);
      });
  }

  database() {
    mongoose.Promise = Promise;
    mongoose
      .connect(this.config.dbUrl, { useMongoClient: true })
      .then(() => console.log(`connected to ${this.config.dbUrl}`))
      .catch((err) => {
        throw new Error(err);
      });

    //this.redisClient = new RedisClient(this.config.redisUrl);
  }

  listen() {
    return Q.nbind(this.express.listen, this.express)(this.port)
      .then(() => Q.resolve(this.port));
  }


  static listen(port) {
    return new API(port).listen();
  }

  static server() {
    return (new API()).express;
  }

  static get config() {
    const env = requireAll(`${__dirname}/config`)[process.env.NODE_ENV || 'development'];
    const defaultEnv = require('./config/default');

    const result = { ...defaultEnv, ...env };
    return result;
  }
  static get Error() {
    return APIError;
  }
}


module.exports = API;
