import express from "express";
import addRoute from "../../../helpers/routeHandler";
import { IBaseRouterElement } from "../../../routes/routeInterface";
import { roleDescription } from "../../../authentication/roles/config/roleDescription";
import taskController from "../controller/task.controller";

const taskRouter = express.Router();

const taskRoutes: IBaseRouterElement[] = [
  {
    method: ["post"],
    path: "/",
    pathCallback: taskController.create,
    allowed: [roleDescription.ADMIN.slug,roleDescription.CUSTOMER.slug],
  },
  {
    method: ["get"],
    path: "/me/:id",
    pathCallback: taskController.findOne,
    allowed: [roleDescription.CUSTOMER.slug],
  },
  {
    method: ["get"],
    path: "/me",
    pathCallback: taskController.findAllByMe,
    allowed: [roleDescription.CUSTOMER.slug],
  },
  
  {
    method: ["get"],
    path: "/:id",
    pathCallback: taskController.findOne,
    allowed: [roleDescription.ADMIN.slug],
  },
 
  {
    method: ["get"],
    path: "/",
    pathCallback: taskController.findAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["put"],
    path: "/me/:id",
    pathCallback: taskController.updateByMe,
    allowed: [roleDescription.CUSTOMER.slug],
  },
  {
    method: ["put"],
    path: "/:id",
    pathCallback: taskController.update,
    allowed: [roleDescription.ADMIN.slug],
  },

  {
    method: ["delete"],
    path: "/me/:id",
    pathCallback: taskController.deleteOneByMe,
    allowed: [roleDescription.CUSTOMER.slug],
  },
  {
    method: ["delete"],
    path: "/me",
    pathCallback: taskController.deleteAllByMe,
    allowed: [roleDescription.CUSTOMER.slug],
  },
  
  {
    method: ["delete"],
    path: "/",
    pathCallback: taskController.deleteAll,
    allowed: [roleDescription.ADMIN.slug],
  },
  {
    method: ["delete"],
    path: "/:id",
    pathCallback: taskController.deleteOne,
    allowed: [roleDescription.ADMIN.slug],
  },
];

for (const routeItem of taskRoutes) {
  for (const methodItem of routeItem.method) {
    addRoute(taskRouter, methodItem, routeItem.path, routeItem.pathCallback);
  }
}

export default taskRouter;
export const routeTable = taskRoutes;
