import express from "express";

import addRoute from "../../../helpers/routeHandler";
import rolesController from "../controller/roles.controller";
import { IBaseRouterElement } from "../../../routes/routeInterface";
import { roleDescription } from "../config/roleDescription";

const rolesRouter = express.Router();

const roleRoutes: IBaseRouterElement[] = [
  {
    method: ["post"],
    path: "/",
    pathCallback: rolesController.create,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["get"],
    path: "/",
    pathCallback: rolesController.findAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["get"],
    path: "/:id",
    pathCallback: rolesController.findOne,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["put"],
    path: "/:id",
    pathCallback: rolesController.update,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["delete"],
    path: "/",
    pathCallback: rolesController.deleteAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["delete"],
    path: "/:id",
    pathCallback: rolesController.deleteOne,
    allowed: [roleDescription.ADMIN.slug],
  },
];

for (const routeItem of roleRoutes) {
  for (const methodItem of routeItem.method) {
    addRoute(rolesRouter, methodItem, routeItem.path, routeItem.pathCallback);
  }
}

export default rolesRouter;
export const routeTable = roleRoutes;
