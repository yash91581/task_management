import { Request, Response } from "express";
import { IRequest } from "request-types";
import rolesServices from "../../../authentication/roles/services/roles.services";
import bcryptUtils from "../../../commonUtils/bcrypt";
import { sendResponseOld } from "../../../commonUtils/sendResponse";
import logger from "../../../commonUtils/winstonLogger";
import usersServices from "../services/users.services";

interface IFilterRequest {
  filter: [{ field: string; operator: string; value: string }];
  offset?: number;
  record?: number;
  sortBy?: string;
  orderBy?: number;
}

const populatedArray = [{ path: "roles", select: "name slug" }];

const userController = {
  create: async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, confirmPassword, roles } = req.body;
      if (!fullName) {
        return res
          .status(400)
          .json(sendResponseOld(404, false, null, "Full name is required"));
      }
      if (!email) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "E-mail is required"));
      }
      if (!password) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Password is required"));
      }
      if (!confirmPassword) {
        return res
          .status(400)
          .json(
            sendResponseOld(400, false, null, "Confirm password is required")
          );
      }
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Password dosent match"));
      }
      if ((roles || roles == "") && !Array.isArray(roles)) {
        return res
          .status(400)
          .json(
            sendResponseOld(400, false, null, "Roles should be of type array")
          );
      }
      if (roles && roles.length <= 0) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Roles should not be empty"));
      }
      const checkUserAlredyExists = await usersServices.findOne({ email });
      if (checkUserAlredyExists) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              400,
              false,
              null,
              "User with this E-mail alredy exists"
            )
          );
      }
      if (roles && roles.length > 0) {
        for (const roleIds of roles) {
          const isRoleExists = await rolesServices.findOne({
            isDeleted: false,
            _id: roleIds,
          });
          if (!isRoleExists.success) {
            return res
              .status(400)
              .json(
                sendResponseOld(
                  400,
                  false,
                  null,
                  `role not found with id ${roleIds}`
                )
              );
          } else {
            continue;
          }
        }
      }
      const protectedPassword = await bcryptUtils.hashPassword(password);
      const getDefaultRole: any = await rolesServices.getDefaultRole();
      if (!getDefaultRole.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, "Default role for user not found")
          );
      }
      const regsiterData = {
        fullName,
        email,
        password: protectedPassword,
        roles: roles || [getDefaultRole.data._id],
      };
      const registerUser = await usersServices.create(regsiterData);
      return res
        .status(200)
        .json(
          sendResponseOld(201, true, registerUser, "User created successfully")
        );
    } catch (createUserError) {
      logger.error("createUserError :: ", createUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  me: async (req: Request, res: Response) => {
    try {
      const user: any = req.user;
      if (!user) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "User not found"));
      }
      const getUser = await usersServices.findOne(
        { isDeleted: false, _id: user._id },
        "-password",
        populatedArray
      );
      if (getUser) {
        return res.status(200).json(sendResponseOld(200, true, getUser, ""));
      } else {
        return res
          .status(200)
          .json(sendResponseOld(200, false, null, "User not found"));
      }
    } catch (findOneUserError) {
      logger.error("findOneUserError :: ", findOneUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  findOne: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const getUserDetails = await usersServices.findOne(
        { _id: userId, isDeleted: false },
        "-password",
        populatedArray
      );
      if (getUserDetails) {
        return res
          .status(200)
          .json(sendResponseOld(200, true, getUserDetails, ""));
      } else {
        return res
          .status(200)
          .json(sendResponseOld(404, false, null, "User not found"));
      }
    } catch (findAllUserError) {
      logger.error("findAllUserError :: ", findAllUserError);
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
      const getUserDetails: any = await usersServices.find(
        filterCriteria,
        "-password",
        populatedArray
      );
      if (getUserDetails.data.length > 0) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              200,
              true,
              getUserDetails.data,
              "",
              getUserDetails.count
            )
          );
      } else {
        return res
          .status(200)
          .json(sendResponseOld(404, false, null, "User not found"));
      }
    } catch (findAllUserError) {
      logger.error("findAllUserError :: ", findAllUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteOne: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const deleteUser = await usersServices.deleteOne({
        isDeleted: false,
        _id: userId,
      });
      if (!deleteUser) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to delete user"));
      } else {
        return res
          .status(200)
          .json(sendResponseOld(200, true, null, "User deleted successfully"));
      }
    } catch (deleteOneUserError) {
      logger.error("deleteOneUserError :: ", deleteOneUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  deleteAll: async (req: Request, res: Response) => {
    try {
      const deleteAllUsers = await usersServices.deleteAll({
        isDeleted: false,
      });
      return res
        .status(200)
        .json(
          sendResponseOld(
            200,
            true,
            deleteAllUsers,
            "User deleted successfully"
          )
        );
    } catch (deleteAllUserError) {
      logger.error("deleteAllUserError :: ", deleteAllUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  update: async (req: IRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const userUpdateData = req.body;
      if (
        (userUpdateData.roles || userUpdateData.roles == "") &&
        !Array.isArray(userUpdateData.roles)
      ) {
        return res
          .status(400)
          .json(
            sendResponseOld(400, false, null, "Roles should be of type array")
          );
      }
      if (userUpdateData.roles && userUpdateData.roles.length <= 0) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Roles should not be empty"));
      }
      if (userUpdateData.email) {
        const checkUserAlredyExists = await usersServices.findOne({
          email: userUpdateData.email,
        });
        if (checkUserAlredyExists) {
          return res
            .status(400)
            .json(
              sendResponseOld(
                400,
                false,
                null,
                "User with this email already exits"
              )
            );
        }
      }
      if (userUpdateData.password && !userUpdateData.confirmPassword) {
        return res
          .status(400)
          .json(
            sendResponseOld(400, false, null, "Confirm password is required")
          );
      }
      if (userUpdateData.confirmPassword && !userUpdateData.password) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Password is required"));
      }
      if (
        userUpdateData.confirmPassword &&
        userUpdateData.password &&
        userUpdateData.password !== userUpdateData.confirmPassword
      ) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Password does not match"));
      }
      if (userUpdateData.confirmPassword && userUpdateData.password) {
        userUpdateData.password = await bcryptUtils.hashPassword(
          userUpdateData.password
        );
      }
      if (userUpdateData.roles && userUpdateData.roles.length > 0) {
        for (const roleIds of userUpdateData.roles) {
          const isRoleExists = await rolesServices.findOne({
            isDeleted: false,
            _id: roleIds,
          });
          if (!isRoleExists.success) {
            return res
              .status(400)
              .json(
                sendResponseOld(
                  400,
                  false,
                  null,
                  `role not found with id ${roleIds}`
                )
              );
          } else {
            continue;
          }
        }
      }
      const updateUser = await usersServices.update(
        { isDeleted: false, _id: userId },
        userUpdateData
      );
      if (!updateUser) {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Unable to update user"));
      }
      return res
        .status(200)
        .json(
          sendResponseOld(200, true, updateUser, "User updated successfully")
        );
    } catch (updateUserError) {
      logger.error("updateUserError :: ", updateUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },
};
export default userController;
