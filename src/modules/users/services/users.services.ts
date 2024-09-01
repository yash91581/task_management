import logger from '../../../commonUtils/winstonLogger';
import { sendServiceResult } from '../../../commonUtils/sendResponse';
import { UserModel } from '../model/users.model';
import usersServices from '../services/users.services.base';

interface IFindCondition {
	filters: any;
	offset?: number;
	record?: number;
	sortBy?: any;
	orderBy?: any;
}
export default {
	...usersServices,
	find: async (condition: IFindCondition, projectionString = '', populatedArray: any[] = []) => {
		try {
			let { filters, offset, record, sortBy, orderBy } = condition;
			offset = offset ? offset : 0;
			record = record ? record : -1;

			let sortByAndOrderBy: any = {};
			if (sortBy && orderBy) {
				sortByAndOrderBy = { [sortBy]: orderBy };
			}

			let data: any;
			if (record > 0) {
				data = await UserModel.find(filters, projectionString)
					.populate(populatedArray)
					.skip(record * offset)
					.limit(record)
					.sort(sortByAndOrderBy);
			} else {
				data = await UserModel.find(filters, projectionString).populate(populatedArray).sort(sortByAndOrderBy);
			}

			const count = await UserModel.countDocuments(filters);

			return { status: 200, success: true, data, count };
		} catch (userServicesError) {
			logger.error('userServicesError :: find :: ', userServicesError);
			return sendServiceResult(200, false, null, 'userServicesError :: find');
		}
	},
};
