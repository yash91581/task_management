import { Response } from 'express';
import logger from './winstonLogger';

interface ISendResponseOld {
	status: number;
	success: boolean;
	data?: any;
	message?: string;
	count?: number;
}

interface ISendResponse {
	success: boolean;
	data?: any;
	message?: string;
	count?: number;
}

export const sendResponseOld = (
	status: number = 200,
	success: boolean,
	data?: any,
	message?: string,
	count?: number,
	filterData?: any
) => {
	const response: ISendResponseOld = {
		status,
		success,
		data,
		message,
		count
	};
	return response;
};

type ResponseStatusType = 200 | 302 | 400 | 401 | 403 | 404 | 409 | 500 | 501;
export function sendResponse(
	res: Response,
	status: ResponseStatusType,
	success: boolean,
	data?: any,
	message?: string,
	count?: number
) {
	res.status(status).json({ success, data, message, count });
}

export const sendServiceResult = (
	status: ResponseStatusType = 200,
	success: boolean,
	data: any,
	message = '',
	count?: number
) => {
	const responseData = { status, success, data, message, count };

	if (typeof status !== 'number') {
		const statusError = new Error();
		logger.info('error', statusError.stack);
		logger.error(
			`Argument - status - should be of type number. Received type - ${typeof status}. Using default status - 200.`
		);
		responseData.status = 200;
	}
	return responseData;
};
