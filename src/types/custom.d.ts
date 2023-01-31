import { TUsersPayload } from '../users/service/users.payload';
import { Request } from 'express';

export interface CustomRequest extends Request {
	user?: TUsersPayload;
}
