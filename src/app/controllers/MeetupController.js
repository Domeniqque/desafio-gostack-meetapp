import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      offset: (page - 1) * 10,
      limit: 10,
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'date',
        'isFinished',
        'created_at',
      ],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

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
        .json({ error: 'Not allowed to create past meetups.' });
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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    await schema.validate(req.body).catch(({ errors }) => {
      return res.status(400).json({ message: 'Validation fails.', errors });
    });

    const { date, file_id } = req.body;

    // Check if is past date
    if (date) {
      const isPastDate = isBefore(parseISO(date), new Date());

      if (isPastDate) {
        return res
          .status(400)
          .json({ error: 'Not allowed to update past meetups.' });
      }
    }

    // Check if file exists
    if (file_id) {
      const fileExists = await File.findByPk(file_id);

      if (!fileExists) {
        return res.status(400).json({ error: 'File does not exists.' });
      }
    }

    // Checke if exists
    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found.' });
    }

    // Check if is organizer
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot permissions to update this meetup.' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
