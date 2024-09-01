import { RouterModule } from "../../types/routes-types";
import { ROUTE_MODULE_LIST_E } from "./route.module";

import authPreRouter, {
  routeTable as authRoutePreTable,
} from "../../authentication/auth/routes/auth.pre.routes";
export const preRouteTable: RouterModule.IRouteEntry[] = [
  {
    routePath: ROUTE_MODULE_LIST_E.AUTH,
    router: authPreRouter,
    routetable: authRoutePreTable,
  },
];
