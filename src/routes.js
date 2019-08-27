import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileControler from './app/controllers/FileControler';
import MeetupController from './app/controllers/MeetupController';

const upload = multer(multerConfig);

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello world' });
});

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileControler.create);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetup_id', MeetupController.update);
routes.delete('/meetups/:meetup_id', MeetupController.delete);

export default routes;
