import { Router } from 'express';
import { IBaseRouterElement } from '../routes/routeInterface';

export namespace RouterModule {
	export interface IRouteEntry {
		routetable?: IBaseRouterElement[];
		routePath: string;
		router: Router;
	}
}
