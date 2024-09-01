import { RouterModule } from '../../types/routes-types';
import { ROUTE_MODULE_LIST_E } from './route.module';
import rolesRouter, { routeTable as rolesRouteTable } from '../../..../../authentication/roles/routes/roles.routes';
import userRouter, { routeTable as userRouteTable } from '../../modules/users/routes/users.routes';
import taskRouter,{routeTable as taskRouteTable} from '../../modules/task/routes/task.routes';
export const routeTable: RouterModule.IRouteEntry[] = [
	{ routePath: ROUTE_MODULE_LIST_E.ROLES, router: rolesRouter, routetable: rolesRouteTable },
	{ routePath: ROUTE_MODULE_LIST_E.USERS, router: userRouter, routetable: userRouteTable },
	{ routePath: ROUTE_MODULE_LIST_E.TASKS, router: taskRouter, routetable: taskRouteTable },

];
