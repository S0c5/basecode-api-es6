import mongoose from 'mongoose';
import Q from 'q';

class database {
  static clear() {
    return Q.nbind(mongoose.connection.dropDatabase, mongoose.connection)();
  }

  static model(name) {
    try {
      return require(`./${name}`);
    } catch (err) {
      return mongoose.model(name);
    }
  }
}

module.exports = database;
