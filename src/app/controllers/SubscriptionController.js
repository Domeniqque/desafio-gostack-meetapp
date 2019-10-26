import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Queue from '../../lib/Queue';
import SubscribedMail from '../jobs/SubscribedMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          include: [
            {
              model: File,
              as: 'banner',
              attributes: ['name', 'url', 'path', 'id'],
            },
            {
              model: User,
              as: 'organizer',
              attributes: ['id', 'name', 'email'],
            },
          ],
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Check if user is the meetup organizer
    if (meetup.user_id === req.userId) {
      return res.status(401).json({
        error: 'You can only subscribe to events from others organizers.',
      });
    }

    // Check if meetup is finished
    if (meetup.finished) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe on finished meetups.' });
    }

    // Check the date of others user subscriptions
    const hasConcurrentlySubscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (hasConcurrentlySubscriptions.length) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time." });
    }

    const subscription = await Subscription.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    const subscribedUser = await User.findByPk(req.userId, {
      attributes: ['name', 'email'],
    });

    Queue.add(SubscribedMail.key, {
      meetup,
      subscribedUser,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const { meetup_id } = req.params;

    // Check if user is subscribed
    const subscription = await Subscription.findOne({
      where: {
        meetup_id,
        user_id: req.userId,
      },
    });

    if (!subscription) {
      return res
        .status(401)
        .json({ error: 'You are not subscribed for this meetup.' });
    }

    await subscription.destroy();

    return res.json({ message: 'Unsubscribed successfully!' });
  }
}

export default new SubscriptionController();
