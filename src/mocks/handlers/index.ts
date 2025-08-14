import { authHandlers } from './auth';
import { userHandlers } from './user';
import { featureHandlers } from './feature';

export const handlers = [...authHandlers, ...userHandlers, ...featureHandlers];
