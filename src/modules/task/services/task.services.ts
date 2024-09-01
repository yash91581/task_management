import logger from '../../../commonUtils/winstonLogger';
import { sendServiceResult } from '../../../commonUtils/sendResponse';
import { TasksModel } from '../model/task.model';
import taskServices from './task.services.base';

interface IFindCondition {
	filters: any;
	offset?: number;
	record?: number;
	sortBy?: any;
	orderBy?: any;
}
export default {
	...taskServices,
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
				data = await TasksModel.find(filters, projectionString)
					.populate(populatedArray)
					.skip(record * offset)
					.limit(record)
					.sort(sortByAndOrderBy);
			} else {
				data = await TasksModel.find(filters, projectionString).populate(populatedArray).sort(sortByAndOrderBy);
			}
			const count = await TasksModel.countDocuments(filters);
			return { status: 200, success: true, data, count };
		} catch (taskServicesError) {
			logger.error('findEnquiriesServicesError :: find :: ', taskServicesError);
			return sendServiceResult(200, false, null, 'taskServicesError :: find');
		}
	},
};
