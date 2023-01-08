import { IMiddleware } from './middleware.interface';
import { NextFunction, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { ITokenService } from '../../services/jwt/token.service.interface';
import { HttpError } from '../../errors/http-error';
import { CustomRequest } from '../../types/custom';
import { TUsersPayload } from '../../users/service/users.payload';

export class AuthMiddleware implements IMiddleware {
	constructor(@inject(TYPES.ITokenService) private tokenService: ITokenService) {}

	async execute(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		if (req?.headers?.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const payload = await this.tokenService.check(
				token,
				process.env.JWT_ACCESS_SECRET || 'SECRET',
			);
			if (payload) {
				req.user = payload as TUsersPayload;
				next();
			} else {
				next(new HttpError(403, 'Доступ запрещён', 'AuthMiddleware'));
			}
		} else {
			next(new HttpError(401, 'Требуется авторизация', 'AuthMiddleware'));
		}
	}
}
