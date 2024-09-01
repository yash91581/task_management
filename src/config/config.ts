import dotenv from 'dotenv';
import { roleDescription } from '../authentication/roles/config/roleDescription';

dotenv.config();

export const PORT = process.env.PORT;

export const NODE_ENV = process.env.NODE_ENV;

export const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET || '';

export const HOSTNAME_URL = process.env.HOSTNAME_URL;

export const DB_DATA = {
	DB_URL: process.env.DB_URL || '',
	DB_NAME: process.env.DB_NAME || ''
};

export const API_CONFIG = {
	BASE_ENDPOINT: process.env.BASE_ENDPOINT,
	API_VERSION: process.env.API_VERSION
};

export const ADMIN_CREDENTIALS = {
	fullName: process.env.DEFAULT_ADMIN_NAME,
	email: process.env.DEFAULT_ADMIN_EMAIL,
	password: process.env.DEFAULT_ADMIN_PASSWORD || "",
	roleSlug: roleDescription.ADMIN.slug
};

export const DEFAULT_USERS = [
	{
		fullName: process.env.DEFAULT_ADMIN_NAME,
		email: process.env.DEFAULT_ADMIN_EMAIL,
		password: process.env.DEFAULT_ADMIN_PASSWORD,
		roleSlug: roleDescription.ADMIN.slug
	}
];

export const JWT_CONFIG = {
	JWT_SECRET: process.env.JWT_SECRET || '',
	JWT_LOGIN_EXPIRES_IN: process.env.JWT_LOGIN_EXPIRES_IN,
	JWT_PASSWORD_RESET_EXPIRES_IN: process.env.JWT_PASSWORD_RESET_EXPIRES_IN,
	JWT_VERIFICATION_EXPIRES_IN: process.env.JWT_VERIFICATION_EXPIRES_IN,
};