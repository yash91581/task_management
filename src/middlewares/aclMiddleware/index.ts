import { NextFunction, Response } from 'express';
import { IRequest } from 'request-types';
import { routeTable } from '../../routes/routeTable/routes.table';
import { groupBy as groupBylodash } from 'lodash';

// routeTable;
const routeMap = groupBylodash(routeTable, 'routePath');

function isReqMethodMatching(reqMethod: string, routeTableMethodArr: string[]) {
	for (const routeTableMethodItem of routeTableMethodArr) {
		if (reqMethod.toLowerCase() === routeTableMethodItem.toLocaleLowerCase()) {
			return true;
		}
	}
	return false;
}

function isRoutePathLenMatching(routePath: string, routePathArr: string[], reqRoutePathArr: string[]) {
	if (routePath.endsWith('/')) {
		return routePathArr.length === reqRoutePathArr.length + 1;
	} else {
		return routePathArr.length === reqRoutePathArr.length;
	}
}

function isUserAllowed(userRoleArr: any[], allowedArr: string[]) {
	for (const userRoleItem of userRoleArr) {
		if (allowedArr.includes(userRoleItem.slug)) {
			return true;
		}
	}
	return false;
}

export const aclMiddleWare = () => {
	return (req: IRequest, res: Response, next: NextFunction) => {
		const requestUrl = req.originalUrl;

		const requestPathArray = requestUrl.split('/');
		let moduleFound = requestPathArray[3];

		if (moduleFound.includes('?')) {
			const moduleNameWithParams = moduleFound.split('?');
			moduleFound = moduleNameWithParams[0];
		}

		const reqRoutePathArr = requestPathArray.splice(4);

		reqRoutePathArr.unshift('');

		let matchedRouteTableItem = null;
		if (routeMap[moduleFound]) {
			for (const routeItem of routeMap[moduleFound]) {
				if (!routeItem.routetable || !Array.isArray(routeItem.routetable)) {
					next('route table entry for module - ' + moduleFound + ' is not found');
					return;
				}
				for (const routeTableItem of routeItem?.routetable) {
					const routePathArr = routeTableItem.path.split('/');

					if (
						isReqMethodMatching(req.method, routeTableItem.method) &&
						isRoutePathLenMatching(routeTableItem.path, routePathArr, reqRoutePathArr)
					) {
						let isBreak = false;
						const tempReqRoutePathArr = [...reqRoutePathArr];
						if (routeTableItem.path.endsWith('/')) {
							tempReqRoutePathArr.unshift('');
						}

						for (let counter = 0; counter < tempReqRoutePathArr.length; counter++) {
							//remove query parameters from the incoming route
							const tempRoutePathWithoutQuery = tempReqRoutePathArr[counter].split('?')[0];

							if (!(tempRoutePathWithoutQuery === routePathArr[counter] || routePathArr[counter].startsWith(':'))) {
								isBreak = true;
								break;
							}
						}
						if (!isBreak) {
							matchedRouteTableItem = routeTableItem;
							break;
						}
					}
				}
			}
		}

		if (matchedRouteTableItem) {
			const user: any = req.user;
			if (
				!(
					matchedRouteTableItem &&
					matchedRouteTableItem.allowed &&
					isUserAllowed(user.roles, matchedRouteTableItem.allowed)
				)
			) {
				return res.status(403).json({ message: 'You are not authorized to access this resource.' });
			}
		}
		next();
	};
};
