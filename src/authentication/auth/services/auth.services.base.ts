import logger from '../../../commonUtils/winstonLogger';
import { UserModel } from '../../../modules/users/model/users.model';

const authServices = {
	create: async (data: any) => {
		try {
			const createData = await UserModel.create(data);
			return createData;
		} catch (createAuthServiceError) {
			logger.error('createAuthServiceError ::', createAuthServiceError);
		}
	},
	findOne: async (condition: any) => {
		try {
			const findOneResult = await UserModel.findOne(condition);
			return findOneResult;
		} catch (findOneAuthServiceError) {
			logger.error('findOneAuthServiceError :: ', findOneAuthServiceError);
		}
	},
	findAll: async (condition: any) => {
		try {
			const findAllResult = await UserModel.find(condition);
			return findAllResult;
		} catch (findAllAuthServiceError) {
			logger.error('findAllAuthServiceError :: ', findAllAuthServiceError);
		}
	},
	deleteOne: async (condition: any) => {
		try {
			const deleteOneResult = await UserModel.deleteOne(condition);
			return deleteOneResult;
		} catch (deleteOneAuthServiceError) {
			logger.error('deleteOneAuthServiceError :: ', deleteOneAuthServiceError);
		}
	},
	deleteAll: async (condition: any) => {
		try {
			const deleteManyResult = await UserModel.deleteMany(condition);
			return deleteManyResult;
		} catch (deleteAllAuthServiceError) {
			logger.error('deleteAllAuthServiceError :: ', deleteAllAuthServiceError);
		}
	},
	update: async (condition: any, updatedData: any) => {
		try {
			const updateResult = await UserModel.findOneAndUpdate(condition, { $set: updatedData }, { new: true });
			return updateResult;
		} catch (updateAuthServiceError) {
			logger.error('updateAuthServiceError :: ', updateAuthServiceError);
		}
	}
};
export default authServices;
