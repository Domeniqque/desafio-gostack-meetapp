import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
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
    if (meetup.isFinished) {
      return res
        .status(401)
        .json({ error: 'You cannot subscribe on finished meetups.' });
    }

    // Check if user is subscribed
    if (meetup.Subscription) {
      const isSubscribed = meetup.Subscriptions.find(
        s => s.user_id === req.userId
      );

      if (isSubscribed) {
        return res
          .status(401)
          .json({ error: 'You are already subscribed for this meetup.' });
      }
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

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: 'Novo inscrito',
      template: 'subscription',
      context: {
        title: 'Novo Inscrito',
        userName: meetup.organizer.name,
        subscribedUserName: subscribedUser.name,
        subscribedUserEmail: subscribedUser.email,
        meetupTitle: meetup.title,
        meetupLocale: meetup.locale,
        meetupDate: format(meetup.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
