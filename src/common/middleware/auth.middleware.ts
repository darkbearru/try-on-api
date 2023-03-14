import { IMiddleware } from './middleware.interface';
import { NextFunction, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { ITokenService } from '../../services/jwt/token.service.interface';
import { HttpError } from '../../errors/http-error';
import { CustomRequest } from '../../types/custom';
import { TUsersPayload } from '../../users/service/users.payload';
import { UsersMessages } from '../../users/users.messages';
import { TUserRoles } from '../../users/users.roles';

export class AuthMiddleware implements IMiddleware {
	constructor(
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
		private _role?: TUserRoles,
	) {}

	async execute(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		if (!req?.headers?.authorization) {
			return next(new HttpError(401, UsersMessages.NeedAuth, 'AuthMiddleware'));
		}

		const token = req.headers.authorization.split(' ')[1];
		const payload = await this.tokenService.check(token, process.env.JWT_ACCESS_SECRET || 'SECRET');
		if (!(payload && typeof payload === 'object')) {
			return next(new HttpError(403, UsersMessages.AuthForbidden, 'AuthMiddleware'));
		}

		req.user = payload as TUsersPayload;
		if (this._role && this._role !== req.user.role && this._role !== 'admin') {
			return next(new HttpError(403, UsersMessages.AuthForbidden, 'AuthMiddleware'));
		}
		next();
	}
}
