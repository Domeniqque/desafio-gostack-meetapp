import multer from 'multer';
import { resolve, extname } from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, value) => {
        if (err) cb(err);

        const fileName = value.toString('hex') + extname(file.originalname);

        return cb(null, fileName);
      });
    },
  }),
};
