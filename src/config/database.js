module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  password: 'docker',
  username: 'postgres',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
