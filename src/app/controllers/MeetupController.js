import * as Yup from 'yup';
import { isBefore, parseISO, endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const where = {};
    const { page = 1, date } = req.query;

    if (date) {
      const searchDate = parseISO(date);
      console.log(searchDate);
      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      limit: 10,
      offset: page * 10 - 10,
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'url', 'path'],
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
        .json({ error: 'An meetup can only be updated by its organizer' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id, {
      attributes: ['id', 'user_id', 'date', 'finished'],
    });

    // Check if exists
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not fount.' });
    }

    // Check if user is the organizer
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'An meetup can only be canceled by its organizer.' });
    }

    // Check if meetups is finished
    if (meetup.finished) {
      return res
        .status(401)
        .json({ error: 'An meetup finished cannot be canceled.' });
    }

    await meetup.destroy();

    return res.json({ message: 'Meetup canceled.' });
  }
}

export default new MeetupController();
