import { TUsersPayload } from '../../users/service/users.payload';
import { User } from '../../users/user.entity';
import { Response } from 'express';
import { TRefreshResponse, TTokensList } from './token.types';
import { JwtPayload } from 'jsonwebtoken';

export interface ITokenService {
	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string>;
	generate(user: User): Promise<TTokensList>;
	check(token: string, secret: string): JwtPayload | string;
	save(res: Response, token: string): Response;
	refresh(token: string, res: Response): Promise<TRefreshResponse | null>;
}
