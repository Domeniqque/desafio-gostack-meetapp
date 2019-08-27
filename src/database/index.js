import Sequelize from 'sequelize';

import configDatabase from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class Database {
  constructor() {
    this.connection = new Sequelize(configDatabase);

    this.init();
  }

  init() {
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
