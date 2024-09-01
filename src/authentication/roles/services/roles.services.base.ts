import logger from '../../../commonUtils/winstonLogger';
import { sendServiceResult } from '../../../commonUtils/sendResponse';
import { DEFAULT_ROLE_SLUG, roleDescription } from '../config/roleDescription';
import { RolesModel } from '../model/roles.model';
const rolesServices = {
	init: async () => {
		try {
			const roleSlugs = Object.values(roleDescription).map((items: any) => items.slug);
			const existingRoles = await RolesModel.find({ slug: roleSlugs });
			const existingRolesSlugArray = existingRoles.map((existingRoleItem) => existingRoleItem.slug);
			for (const desiredRoleItem of Object.values(roleDescription)) {
				if (!existingRolesSlugArray.includes(desiredRoleItem.slug)) {
					const createRoleResult = await RolesModel.create(desiredRoleItem);
					if (createRoleResult) {
						existingRoles.push(createRoleResult);
					} else {
						logger.error('rolesServices :: init:: not able to create role-', desiredRoleItem);
					}
				}
			}
			return sendServiceResult(200, true, existingRoles, '');
		} catch (initrolesServicesError: any) {
			logger.error('initrolesServicesError :: init ::', initrolesServicesError);
			return sendServiceResult(500, false, null, initrolesServicesError.message);
		}
	},

	create: async (data: any) => {
		try {
			const createdDataResult = await RolesModel.create(data);
			if (!createdDataResult) {
				return sendServiceResult(500, false, null, 'Unable to create the role');
			}
			return sendServiceResult(200, true, createdDataResult);
		} catch (createrolesServicesError: any) {
			logger.error('createrolesServicesError :: create ::', createrolesServicesError);
			return sendServiceResult(500, false, null, createrolesServicesError.message);
		}
	},

	findOne: async (condition: any) => {
		try {
			const findOneResult:any = await RolesModel.findOne(condition);
			if (!findOneResult) {
				return sendServiceResult(500, false, null, 'Unable to find the role');
			}
			return sendServiceResult(200, true, findOneResult,"");
		} catch (findOnerolesServicesError: any) {
			logger.error('findOnerolesServicesError :: findOne ::', findOnerolesServicesError);
			return sendServiceResult(500, false, null, findOnerolesServicesError.message);
		}
	},

	findAll: async (condition?: any) => {
		try {
			const findAllResult = await RolesModel.find(condition);
			if (!findAllResult) {
				return sendServiceResult(500, false, null, 'Unable to find the role');
			}
			return sendServiceResult(200, true, findAllResult);
		} catch (findAllrolesServicesError: any) {
			logger.error('findAllrolesServicesError :: findAll ::', findAllrolesServicesError);
			return sendServiceResult(500, false, null, findAllrolesServicesError.message);
		}
	},

	deleteOne: async (condition: any) => {
		try {
			const deletedDataResult = await RolesModel.deleteOne(condition);
			if (!deletedDataResult) {
				return sendServiceResult(500, false, null, 'Unable to delete the role');
			}
			return sendServiceResult(200, true, deletedDataResult);
		} catch (deleteOnerolesServicesError: any) {
			logger.error('deleteOnerolesServicesError :: deleteOne ::', deleteOnerolesServicesError);
			return sendServiceResult(500, false, null, deleteOnerolesServicesError.message);
		}
	},

	deleteAll: async (condition?: any) => {
		try {
			const deleteAllDataResult = await RolesModel.deleteMany(condition);
			if (!deleteAllDataResult) {
				return sendServiceResult(500, false, null, 'Unable to delete the role');
			}
			return sendServiceResult(200, true, deleteAllDataResult);
		} catch (deleteAllrolesServicesError: any) {
			logger.error('deleteAllrolesServicesError :: deleteAll ::', deleteAllrolesServicesError);
			return sendServiceResult(500, false, null, deleteAllrolesServicesError.message);
		}
	},

	update: async (condition: any, updatedData: any) => {
		try {
			const updatedDataResult = await RolesModel.findOneAndUpdate(condition, { $set: { updatedData } }, { new: true });
			if (!updatedDataResult) {
				return sendServiceResult(500, false, null, 'Unable to update the role');
			}
			return sendServiceResult(200, true, updatedDataResult);
		} catch (updaterolesServicesError: any) {
			logger.error('updaterolesServicesError :: update ::', updaterolesServicesError);
			return sendServiceResult(500, false, null, updaterolesServicesError.message);
		}
	},

	getDefaultRole: async () => {
		try {
			const getDefaultRolesResult = await RolesModel.findOne({ slug: DEFAULT_ROLE_SLUG });
			if (!getDefaultRolesResult) {
				return sendServiceResult(404, false, null, 'Unable to get default role');
			}
			return sendServiceResult(200, true, getDefaultRolesResult, '');
		} catch (getDefaultRoleRolesServicesError: any) {
			logger.error('getDefaultRoleRolesServicesError :: getDefaultRole ::', getDefaultRoleRolesServicesError);
			return sendServiceResult(500, false, null, getDefaultRoleRolesServicesError.message);
		}
	}
};

export default rolesServices;
