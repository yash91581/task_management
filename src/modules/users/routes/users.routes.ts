import express from "express";
import addRoute from "../../../helpers/routeHandler";
import userController from "../controller/users.controller";
import { IBaseRouterElement } from "../../../routes/routeInterface";
import { roleDescription } from "../../../authentication/roles/config/roleDescription";

const userRouter = express.Router();

const userRoutes: IBaseRouterElement[] = [
  {
    method: ["post"],
    path: "/",
    pathCallback: userController.create,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["get"],
    path: "/me",
    pathCallback: userController.me,
    allowed: [roleDescription.ADMIN.slug, roleDescription.CUSTOMER.slug],
  },
  {
    method: ["get"],
    path: "/",
    pathCallback: userController.findAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["get"],
    path: "/:id",
    pathCallback: userController.findOne,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["put"],
    path: "/:id",
    pathCallback: userController.update,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["delete"],
    path: "/",
    pathCallback: userController.deleteAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["delete"],
    path: "/:id",
    pathCallback: userController.deleteOne,
    allowed: [roleDescription.ADMIN.slug],
  },
];

for (const routeItem of userRoutes) {
  for (const methodItem of routeItem.method) {
    addRoute(userRouter, methodItem, routeItem.path, routeItem.pathCallback);
  }
}

export default userRouter;
export const routeTable = userRoutes;
