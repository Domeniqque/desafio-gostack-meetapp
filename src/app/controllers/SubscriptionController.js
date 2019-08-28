import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.params;

    const meetup = await Meetup.findByPk(meetup_id);

    // Check if user is the organizer of meetup
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

    if (hasConcurrentlySubscriptions) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time." });
    }

    const subscription = await Subscription.create({
      meetup_id,
      user_id: req.userId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
