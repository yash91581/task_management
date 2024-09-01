import bcryptUtils from "../../../commonUtils/bcrypt";
import rolesServices from "../../../authentication/roles/services/roles.services";
import logger from "../../../commonUtils/winstonLogger";
import { ADMIN_CREDENTIALS, DEFAULT_USERS } from "../../../config/config";
import { UserModel } from "../model/users.model";

const usersServices = {
  init: async () => {
    try {
      for (const userItem of DEFAULT_USERS) {
        const user = await UserModel.findOne({ email: userItem.email });
        if (!user) {
          const userData:any = {
            fullName: userItem.fullName,
            email: userItem.email,
            password:"",
            roles: [],
          };
		  const encryptedPassword=await bcryptUtils.hashPassword(userItem.password || ADMIN_CREDENTIALS.password)
		  userData.password=encryptedPassword
          const getRoleBySlug = await rolesServices.findOne({
            isDeleted: false,
            slug: userItem.roleSlug,
          });
		  if (!getRoleBySlug) {
			logger.error(`Unable to create an user ${userItem.fullName} Role not found.`)
			continue
		  }
		  userData.roles.push(getRoleBySlug.data._id)
		  const createUser=await usersServices.create(userData)
		  if (!createUser) {
			logger.error(`Unable to create an user ${userItem.fullName}`)
		  }
        } else {
          continue;
        }
      }
    } catch (initUserError) {
      logger.error("initUserError :: ", initUserError);
    }
  },

  create: async (data: any) => {
    try {
      const createData = await UserModel.create(data);
      return createData;
    } catch (createUsersServiceError) {
      logger.error("createUsersServiceError ::", createUsersServiceError);
    }
  },

  findOne: async (
    condition: any,
    projectionString = '',
    populatedArray: any[] = []
  ) => {
    try {
      const findOneResult = await UserModel.findOne(
        condition,
        projectionString
      ).populate(populatedArray);

      return findOneResult;
    } catch (findOneUsersServiceError) {
      logger.error("findOneUsersServiceError :: ", findOneUsersServiceError);
    }
  },

  findAll: async (condition: any) => {
    try {
      const findAllResult = await UserModel.find(condition);
      return findAllResult;
    } catch (findAllUsersServiceError) {
      logger.error("findAllUsersServiceError :: ", findAllUsersServiceError);
    }
  },

  deleteOne: async (condition: any) => {
    try {
      const deleteOneResult = await UserModel.findOneAndDelete(condition);
      return deleteOneResult;
    } catch (deleteOneUsersServiceError) {
      logger.error(
        "deleteOneUsersServiceError :: ",
        deleteOneUsersServiceError
      );
    }
  },

  deleteAll: async (condition: any) => {
    try {
      const deleteManyResult = await UserModel.deleteMany(condition);
      return deleteManyResult;
    } catch (deleteAllUsersServiceError) {
      logger.error(
        "deleteAllUsersServiceError :: ",
        deleteAllUsersServiceError
      );
    }
  },

  update: async (condition: any, updatedData: any) => {
    try {
      const updateResult = await UserModel.findOneAndUpdate(
        condition,
        { $set: updatedData },
        { new: true }
      );
      return updateResult;
    } catch (updateAuthServiceError) {
      logger.error("updateAuthServiceError :: ", updateAuthServiceError);
    }
  },

  softDelete: async (condition: any) => {
    try {
      const softDelete = await UserModel.updateOne(condition, {
        $set: { isDeleted: true },
      });
      return softDelete;
    } catch (softDeleteAuthServiceError) {
      logger.error(
        "softDeleteAuthServiceError :: ",
        softDeleteAuthServiceError
      );
    }
  },
};
export default usersServices;
