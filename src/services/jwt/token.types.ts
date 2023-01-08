import { Response } from 'express';
import { TUsersPayload } from '../../users/service/users.payload';

export type TTokensList = {
	access: string;
	refresh: string;
};

export type TRefreshResponse = TUsersPayload & {
	jwt: string;
	res: Response;
};
