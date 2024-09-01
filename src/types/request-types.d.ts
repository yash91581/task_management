import { Request } from 'express';
import User from '../modules/users/model/users.model';

declare interface IRequest extends Request {
	files?: any;
}
