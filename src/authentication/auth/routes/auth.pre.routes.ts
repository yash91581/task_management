import express from 'express';

import authController from '../controller/auth.controller';
import { IBaseRouterElement } from '../../../routes/routeInterface';
import addRoute from '../../../helpers/routeHandler';

const authPreRouter = express.Router();

const authRoutes: IBaseRouterElement[] = [
	{
		method: ['post'],
		path: '/register',
		pathCallback: authController.register,
		allowed: []
	},
	{
		method: ['post'],
		path: '/login',
		pathCallback: authController.login,
		allowed: []
	}
];

for (const routeItem of authRoutes) {
	for (const methodItem of routeItem.method) {
		addRoute(authPreRouter, methodItem, routeItem.path, routeItem.pathCallback);
	}
}

export default authPreRouter;
export const routeTable = authRoutes;
