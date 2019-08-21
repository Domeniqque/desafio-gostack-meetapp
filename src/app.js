import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.routes();
    this.middlewares();
  }

  routes() {
    this.server.use(routes);
  }

  middlewares() {}
}

export default new App().server;
