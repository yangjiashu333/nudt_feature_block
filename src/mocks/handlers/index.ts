import { authHandlers } from './auth';
import { userHandlers } from './user';
import { featureHandlers } from './feature';
import { datasetHandlers } from './dataset';
import { backboneHandlers } from './backbone';
import { classifierHandlers } from './classifier';
import { jobHandlers } from './job';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...featureHandlers,
  ...datasetHandlers,
  ...backboneHandlers,
  ...classifierHandlers,
  ...jobHandlers,
];
