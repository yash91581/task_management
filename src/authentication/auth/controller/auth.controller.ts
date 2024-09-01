import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { roleDescription } from "../../../authentication/roles/config/roleDescription";
import bcryptUtils from "../../../commonUtils/bcrypt";
import { sendResponseOld } from "../../../commonUtils/sendResponse";
import logger from "../../../commonUtils/winstonLogger";
import { HOSTNAME_URL, JWT_CONFIG, NODE_ENV } from "../../../config/config";
import { generateToken } from "../../../middlewares/passportMiddleware/index";
import usersServices from "../../../modules/users/services/users.services";
import rolesServices from "../../roles/services/roles.services";
import authServices from "../services/auth.services";

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, confirmPassword, source } = req.body;
      if (!fullName) {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, "FullName is required"));
      }
      if (!email) {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, "Email is required"));
      }
      if (!password) {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, "Password is required"));
      }
      if (!confirmPassword) {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, "Confirm password is required")
          );
      }
      if (password !== confirmPassword) {
        return res
          .status(200)
          .json(sendResponseOld(400, false, null, "Password doesnt match"));
      }
      const checkUserAlredyExists = await authServices.findOne({ email });
      if (checkUserAlredyExists) {
        return res
          .status(200)
          .json(
            sendResponseOld(
              400,
              false,
              null,
              "User with this E-mail already exists"
            )
          );
      }
      const protectedPassword = await bcryptUtils.hashPassword(password);
      const regsiterData: any = {
        fullName,
        email,
        password: protectedPassword,
        roles: [],
      };
      const getDefaultRole: any = await rolesServices.getDefaultRole();
      if (!getDefaultRole.success) {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, "Default role for user not found")
          );
      }
      regsiterData.roles.push(getDefaultRole?.data?._id);
      const registerUser: any = await authServices.create(regsiterData);
      if (registerUser) {
        return res
          .status(200)
          .json(sendResponseOld(200, true, null, "Registerd Successfully"));
      } else {
        return res
          .status(500)
          .json(sendResponseOld(500, false, null, "Something Went Wrong"));
      }
    } catch (registerUserError) {
      logger.error("registerUserError :: ", registerUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Email is required"));
      }
      if (!password) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "Password is required"));
      }
      const isUserExists: any = await authServices.findOne({ email });
      if (!isUserExists) {
        return res
          .status(400)
          .json(sendResponseOld(400, false, null, "User not found"));
      }
      const isPasswordMatched = await bcryptUtils.comparePassword(
        password,
        isUserExists.password
      );
      if (!isPasswordMatched) {
        return res
          .status(200)
          .json(
            sendResponseOld(400, false, null, "Invalid E-mail or password")
          );
      }
      const rolesArray = [];
      if (isUserExists.roles.length > 0) {
        const getRoles = await rolesServices.findAll({
          _id: isUserExists.roles,
        });
        for (const roleDetails of getRoles.data) {
          rolesArray.push({
            name: roleDetails.name,
            slug: roleDetails.slug,
          });
        }
      }
      const getToken = generateToken({ isUserExists, rolesArray });
      res
        .status(200)
        .json(
          sendResponseOld(200, true, { token: getToken }, "Login successful")
        );
      await usersServices.update(
        { isDeleted: false, _id: isUserExists._id },
        { lastLoggedInAt: new Date(), isFirstLogin: false }
      );
    } catch (loginUserError: any) {
      logger.error("loginUserError :: ", loginUserError);
      return res
        .status(500)
        .json(sendResponseOld(500, false, null, "Internal Server Error"));
    }
  },
};

export default authController;
