import Sequelize from 'sequelize';

import configDatabase from '../config/database';
import Users from '../app/models/Users';

const models = [Users];

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
