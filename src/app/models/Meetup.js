import Sequelize, { Model } from 'sequelize';
import { isAfter } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        isFinished: {
          type: Sequelize.VIRTUAL,
          get() {
            return isAfter(new Date(), this.date);
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { as: 'banner', foreignKey: 'file_id' });

    this.belongsTo(models.User, { as: 'organizer', foreignKey: 'user_id' });
  }
}

export default Meetup;
