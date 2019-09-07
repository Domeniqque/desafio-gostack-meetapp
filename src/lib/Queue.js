import Bee from 'bee-queue';

import SubscribedMail from '../app/jobs/SubscribedMail';

const jobs = [SubscribedMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: {
            host: process.env.REDIS_HOST,
            PORT: process.env.REDIS_PORT,
          },
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  process() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
