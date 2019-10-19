import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'date',
        'finished',
        'created_at',
        'file_id',
      ],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url', 'id'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new OrganizingController();
