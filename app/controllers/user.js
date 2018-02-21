import * as web from 'express-decorators';
import debug from 'debug';
import { User } from '../models';
import { isAuth, isRole } from '../policy';

/**
 * Welcome to awesome controller
 */
@web.basePath('/users') // this is the base of your router!
class UserController {
  constructor() {
    this.logger = debug('user:controller');
  }

  /**
   * This decorator create a endpoint POST and put two
   * middlewares before your router:
   * isAuth:
   *    this check if the request has bearer token in headers, and serialize it into req.user
   *    req.user has the user that is doing the request.
   * isRole: this check if the user retrieved has the role admin.
   */
  @web.post('/', [
    isAuth,
    isRole('admin'),
  ])
  async create(req, res) {
    this.logger('creating user');
    res.success(await User.create(req.body));
  }
  /**
   *  this will be GET /users/:id
   */
  @web.get('/:id')
  async read(req, res) {
    this.logger('read users');
    res.success(await User.findOne({ _id: req.params.id }));
  }

  @web.put('/:id')
  async update(req, res) {
    this.logger('update users');
    res.success(await User.update({ _id: req.params.id }, req.body));
  }

  @web.del('/:id', [
    isAuth,
    isRole('admin'),
  ])
  async del(req, res) {
    this.logger('update users');
    res.success(await User.delete({ _id: req.params.id }));
  }

  @web.get('/')
  async list(req, res) {
    this.logger('update users');
    res.success(await User.find({}));
  }
}

module.exports = UserController;
