import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    await schema.validate(req.body).catch(({ errors }) => {
      return res.status(400).json({ message: 'Validation fails.', errors });
    });

    // Check if is past date
    const isPastDate = isBefore(parseISO(req.body.date), new Date());

    if (isPastDate) {
      return res
        .status(400)
        .json({ error: 'Cannot create meetups with past dates.' });
    }

    // Check if file exists
    const fileExists = await File.findByPk(req.body.file_id);

    if (!fileExists) {
      return res.status(400).json({ error: 'File does not exists.' });
    }

    const { title, description, location, date, file_id } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      file_id,
      user_id: req.userId,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
