import _ from 'underscore';
import faker from 'faker';
import { Client } from '../../../app/models';

class ClientMock {
  static mock(data) {
    return _.extend({
      name: faker.internet.email(),
    }, data);
  }

  static async create(data) {
    const client = await (new Client(ClientMock.mock(data))).save();
    return client;
  }

  static get model() {
    return Client;
  }
}

module.exports = ClientMock;
