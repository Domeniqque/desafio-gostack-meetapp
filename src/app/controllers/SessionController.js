import jwt from 'jsonwebtoken';

import Users from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!user.checkPassword(password)) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: { id, name },
      token: await jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();