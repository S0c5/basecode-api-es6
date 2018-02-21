import _ from 'underscore';
import Q from 'q';
import faker from 'faker';
import { User } from '../../../app/models';

const Client = db.model('client');

class UserMock {
  static mock(data) {
    return _.extend({
      email: faker.internet.email(),
      password: 'admin123',
      role: 'customer',
    }, data);
  }
  static createAndLogin(data) {
    return UserMock.login(data);
  }

  static async login(data) {
    const client = await Client.create();
    const user = await UserMock.create(data);

    user.password = (data && data.password) || 'admin123';

    const token = await request
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        client_id: client.id,
        client_secret: client.secret,
        username: user.email,
        password: user.password,
      })
      .type('json')
      .expect(200)
      .then(res => res.body)
      .then(body => Q.resolve(_.extend(user.toJSON(), {
        token: {
          Authorization: `Bearer ${body.access_token}`,
        },
      })));

    return token;
  }

  static async create(data) {
    const user = await (new User(UserMock.mock(data))).save();
    return user;
  }

  static get model() {
    return User;
  }
}

module.exports = UserMock;
