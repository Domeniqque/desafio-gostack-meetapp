import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileControler from './app/controllers/FileControler';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';
import SubscriptionController from './app/controllers/SubscriptionController';

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

routes.get('/organizing', OrganizingController.index);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:meetup_id', MeetupController.update);
routes.delete('/meetups/:meetup_id', MeetupController.delete);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/meetups/:meetup_id/subscriptions', SubscriptionController.store);

export default routes;
