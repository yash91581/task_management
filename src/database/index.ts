import mongoose from 'mongoose';
import { DB_DATA } from '../config/config';
import logger from '../commonUtils/winstonLogger';

const dbUrl = `${DB_DATA.DB_URL}/${DB_DATA.DB_NAME}`;

const connectOptions = {
	autoIndex: true
};

mongoose
	.connect(dbUrl, connectOptions)
	.then(() => {
		logger.info('Database Connected Successfully');
	})
	.catch((error) => {
		logger.error('Database Connection Error', error);
	});

mongoose.connection.on('connected', () => {
	logger.info('Mongoose default connection open to ' + dbUrl);
});

mongoose.connection.on('error', (error) => {
	logger.error('Mongoose default connection error: ' + error);
});

mongoose.connection.on('disconnected', () => {
	logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', async () => {
	try {
		await mongoose.connection.close(true);
		logger.info('Mongoose connection closed due to application termination');
		process.exit(0);
	} catch (err) {
		logger.error('Error closing Mongoose connection:', err);
		process.exit(1);
	}
});
