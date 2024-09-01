import { Request, Response } from "express";
import { IRequest } from "request-types";
import { sendResponseOld } from "../../../commonUtils/sendResponse";
import logger from "../../../commonUtils/winstonLogger";
import taskServices from "../services/task.services";

const populatedArray = [
  {
    path: "user",
    select: "fullName email _id roles",
    populate: { path: "roles", select: "name slug" },
  },
];

const taskController = {
  create: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      const taskData = req.body;
      if (!user) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "User not found"));
      }
      if (!taskData.title) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Title is required"));
      }
      taskData.user = user._id;
      const createTask = await taskServices.create(taskData);
      if (!createTask) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to create a task"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, createTask, "Task created successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: create ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  findOne: async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const getTask = await taskServices.findOne(
        { isDeleted: false, _id: taskId },
        "",
        populatedArray
      );
      if (!getTask) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "Task not found"));
      }
      return res.status(200).json(sendResponseOld(200, true, getTask, ""));
    } catch (taskControllerError) {
      logger.error("taskControllerError :: findOne ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  findAll: async (req: Request, res: Response) => {
    try {
      const { pageNumber, pageCount, sortBy, orderBy } = req.query;
      const filterCriteria: any = {
        filters: { isDeleted: false },
        offset: Number(pageNumber),
        record: Number(pageCount),
        sortBy,
        orderBy,
      };
      const getAllTasks = await taskServices.find(
        filterCriteria,
        "",
        populatedArray
      );
      if (!getAllTasks.success) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to get the tasks"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, getAllTasks.data, "", getAllTasks.count)
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: findAll :: ", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  findOneByMe: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      const taskId = req.params.id;
      if (!user) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
      const getTask = await taskServices.findOne({
        isDeleted: false,
        user: user._id,
        _id: taskId,
      });
      if (!getTask) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "Task not found"));
      }
      return res.status(200).json(sendResponseOld(200, true, getTask, ""));
    } catch (taskControllerError) {
      logger.error(
        "taskControllerError :: findOneByMe :: ",
        taskControllerError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  findAllByMe: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      if (!user) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
      const { pageNumber, pageCount, sortBy, orderBy } = req.query;
      const filterCriteria: any = {
        filters: { isDeleted: false, user: user._id },
        offset: Number(pageNumber),
        record: Number(pageCount),
        sortBy,
        orderBy,
      };
      const getAllTasks = await taskServices.find(
        filterCriteria,
        "",
        populatedArray
      );
      if (!getAllTasks.success) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to get the tasks"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, getAllTasks.data, "", getAllTasks.count)
        );
    } catch (taskControllerError) {
      logger.error(
        "taskControllerError :: findAllByMe :: ",
        taskControllerError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteOne: async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const deleteTask = await taskServices.deleteOne({
        isDeleted: false,
        _id: taskId,
      });
      if (!deleteTask) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to delete the task"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, deleteTask, "Task deleted successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: deleteOne ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteAll: async (req: Request, res: Response) => {
    try {
      const deleteAllTask = await taskServices.deleteAll({ isDeleted: false });
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, deleteAllTask, "task deleted successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: deleteAll ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteOneByMe: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      const taskId = req.params.id;
      if (!user) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
      const deleteTask = await taskServices.deleteOne({
        isDeleted: false,
        _id: taskId,
        user: user._id,
      });
      if (!deleteTask) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to delete the task"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, deleteTask, "Task deleted successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: deleteOne ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteAllByMe: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      if (!user) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
      const deleteAllTask = await taskServices.deleteAll({
        isDeleted: false,
        user: user._id,
      });
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, deleteAllTask, "task deleted successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: deleteAll ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  update: async (req: IRequest, res: Response) => {
    try {
      const taskId = req.params.id;
      const updatedData = req.body;
      if (updatedData.hasOwnProperty("title") && updatedData.title =="") {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Title is required"));
      }
      if (updatedData.title && typeof updatedData.title !== "string") {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Title must be of type string"));
      }
      if (updatedData.user) {
        return res
        .status(400)
        .json(sendResponseOld(400, false, null, "You are not authorize for this request"));
      }
      const updateTask = await taskServices.update(
        { isDeleted: false, _id: taskId },
        updatedData
      );
      if (!updateTask) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to update task"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, updateTask, "task updated successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: update ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  updateByMe: async (req: IRequest, res: Response) => {
    try {
      const user: any = req.user;
      const taskId = req.params.id;
      const updatedData = req.body;
      if (!user) {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
      if (updatedData.hasOwnProperty("title") && updatedData.title =="") {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Title is required"));
      }
      if (updatedData.title && typeof updatedData.title !== "string") {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Title must be of type string"));
      }
      if (updatedData.user) {
        return res
        .status(400)
        .json(sendResponseOld(400, false, null, "You are not authorize for this request"));
      }
      const updateTask = await taskServices.update(
        { isDeleted: false, _id: taskId, user: user._id },
        updatedData
      );
      if (!updateTask) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to update task"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, updateTask, "task updated successfully")
        );
    } catch (taskControllerError) {
      logger.error("taskControllerError :: update ::", taskControllerError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },
};

export default taskController;
