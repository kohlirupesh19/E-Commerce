import { Router } from 'express';
import { healthRouter } from './health.route.js';
import { systemRouter } from './system.route.js';
import { authRouter } from './auth.route.js';
import { catalogRouter } from './catalog.route.js';
import { checkoutRouter } from './checkout.route.js';

export const v1Router = Router();

v1Router.use(healthRouter);
v1Router.use('/auth', authRouter);
v1Router.use(catalogRouter);
v1Router.use(checkoutRouter);
v1Router.use('/system', systemRouter);
