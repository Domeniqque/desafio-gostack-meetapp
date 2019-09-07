import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import Mail from '../../lib/Mail';

class SubscribedMail {
  get key() {
    return 'SubscribedMail';
  }

  async handle({ data }) {
    const { meetup, subscribedUser } = data;

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
        meetupLocale: meetup.location,
        meetupDate: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new SubscribedMail();
