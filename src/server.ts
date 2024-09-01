import app from './app';
import logger from './commonUtils/winstonLogger';
import { PORT } from './config/config';

app.listen(PORT, () => {
	logger.info(`Express server is started at http://localhost:${PORT}`);
});
