import express from 'express';

import { preRouteTable } from '../routes/routeTable/pre.routes.table';
import { routeTable } from '../routes/routeTable/routes.table';

const preRouter = express.Router();
const router = express.Router();

/***
 * Pre-routes which do not need authoriation or authentication
 */
for (const routeEntry of preRouteTable) {
	preRouter.use(`/${routeEntry.routePath}`, routeEntry.router);
}

/***
 * Routes which do not need authoriation or authentication
 */
for (const routeEntry of routeTable) {
	router.use(`/${routeEntry.routePath}`, routeEntry.router);
}

export default { preRoute: preRouter, route: router };
