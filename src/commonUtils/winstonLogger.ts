import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
	return `${level}: ${timestamp} ${message}`;
});

const logger = createLogger({
	level: 'debug',
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.align(), logFormat),
	transports: []
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: combine(format.colorize(), logFormat)
		})
	);
}

export default logger;
