import { Request, Response } from "express";
import { sendResponseOld } from "../../../commonUtils/sendResponse";
import rolesServices from "../services/roles.services";
import { DEFAULT_ROLE_SLUG, roleDescription } from "../config/roleDescription";
import logger from "../../../commonUtils/winstonLogger";

const rolesController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, "Role name is required"));
      }
      const createRoleUserResult = await rolesServices.create({
        name,
        description,
      });
      if (createRoleUserResult.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              createRoleUserResult.data,
              "Role created successfully"
            )
          );
      } else {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, createRoleUserResult.message)
          );
      }
    } catch (rolesControllerCreateError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: create",
        rolesControllerCreateError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  findAll: async (req: Request, res: Response) => {
    try {
      const getAllRolesResult = await rolesServices.findAll({
        isDeleted: false,
      });
      if (getAllRolesResult.success) {
        return res
          .status(200)
          .json(sendResponseOld(200, true, getAllRolesResult.data, ""));
      } else {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, getAllRolesResult.message));
      }
    } catch (rolesControllerfindAllError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: findAll",
        rolesControllerfindAllError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  findOne: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const getOneRolesResult = await rolesServices.findOne({
        _id: userId,
        isDeleted: false,
      });
      if (getOneRolesResult.success) {
        return res
          .status(200)
          .json(sendResponseOld(200, true, getOneRolesResult.data, ""));
      } else {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, getOneRolesResult.message));
      }
    } catch (rolesControllerfindOneError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: findOne",
        rolesControllerfindOneError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  deleteAll: async (req: Request, res: Response) => {
    try {
      const deleteAllRolesResult = await rolesServices.deleteAll({
        isDeleted: false,
      });
      if (deleteAllRolesResult.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              deleteAllRolesResult.data,
              "Roles deleted successfully"
            )
          );
      } else {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, deleteAllRolesResult.message)
          );
      }
    } catch (rolesControllerdeleteAllError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: deleteAll",
        rolesControllerdeleteAllError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  deleteOne: async (req: Request, res: Response) => {
    try {
      const roleId = req.params.id;
      const deletOneRolesResult = await rolesServices.deleteOne({
        _id: roleId,
      });
      if (deletOneRolesResult.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              deletOneRolesResult.data,
              "Role deleted successfully"
            )
          );
      } else {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, deletOneRolesResult.message));
      }
    } catch (rolesControllerdeleteOneError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: deleteOne",
        rolesControllerdeleteOneError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const roleId = req.params.id;
      const userUpdatedData = req.body;
      const updateRolesResult = await rolesServices.update(
        { _id: roleId, isDeleted: false },
        userUpdatedData
      );
      if (updateRolesResult.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              updateRolesResult.data,
              "Role updated successfully"
            )
          );
      } else {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, updateRolesResult.message));
      }
    } catch (rolesControllerupdateError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: update",
        rolesControllerupdateError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },

  getDefaultRole: async (req: Request, res: Response) => {
    try {
      const getDefaultRolesResult = await rolesServices.findOne({
        slug: DEFAULT_ROLE_SLUG,
      });
      if (getDefaultRolesResult.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              getDefaultRolesResult.data,
              ""
            )
          );
      } else {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, getDefaultRolesResult.message)
          );
      }
    } catch (rolesControllerupdateError) {
      logger.error(
        "authentication :: roles :: controller :: roleController :: update",
        rolesControllerupdateError
      );
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Something went wrong"));
    }
  },
};
export default rolesController;
