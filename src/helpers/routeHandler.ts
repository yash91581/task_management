import express, { Request, Response, NextFunction, Router } from 'express';
import { METHOD_TYPE_T } from '../routes/routeInterface';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (execution: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
	execution(req, res, next).catch(next);
};

const addRoute = (router: Router, methodType: METHOD_TYPE_T, routePath: string, executionFn: AsyncFunction) => {
	switch (methodType) {
		case 'get':
			router.get(routePath, asyncHandler(executionFn));
			break;

		case 'post':
			router.post(routePath, asyncHandler(executionFn));
			break;

		case 'put':
			router.put(routePath, asyncHandler(executionFn));
			break;

		case 'patch':
			router.patch(routePath, asyncHandler(executionFn));
			break;

		case 'delete':
			router.delete(routePath, asyncHandler(executionFn));
			break;
	}
};

export default addRoute;
