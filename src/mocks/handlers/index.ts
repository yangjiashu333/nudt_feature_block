import { authHandlers } from './auth';
import { userHandlers } from './user';
import { featureHandlers } from './feature';
import { datasetHandlers } from './dataset';

export const handlers = [...authHandlers, ...userHandlers, ...featureHandlers, ...datasetHandlers];
