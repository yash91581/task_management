import bcrypt from 'bcrypt';
import logger from './winstonLogger';

const saltRounds = 10;

const bcryptUtils = {
	hashPassword: async (password: string): Promise<string> => {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		return hashedPassword;
	},
	comparePassword: async (password: string, hashedPassword: string) => {
		try {
			const isMatch = await bcrypt.compare(password, hashedPassword);
			return isMatch;
		} catch (comparePasswordBcryptUtilsError) {
			logger.error('comparePasswordBcryptUtilsError :: ', comparePasswordBcryptUtilsError);
		}
	}
};
export default bcryptUtils;
