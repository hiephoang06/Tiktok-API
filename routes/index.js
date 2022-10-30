import { ApiRouters } from './api/index.js';

export const routes = (app) => {
  app.use('/api', ApiRouters);
};
