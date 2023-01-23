import { BaseController } from '../common/controller/base.controller';
import { IUsersController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILoggerService } from '../services/logger/logger.service.interface';
import { Request, Response, NextFunction } from 'express';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { UserDTO } from './dto/user.dto';
import 'reflect-metadata';
import { IUsersService } from './service/users.service.interface';
import { HttpError } from '../errors/http-error';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { ITokenService } from '../services/jwt/token.service.interface';
import { CustomRequest } from '../types/custom';
import { JSONCookies } from 'cookie-parser';
import { UsersMessages } from './users.messages';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserDTO)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserDTO)],
			},
			{
				path: '/logout',
				method: 'post',
				func: this.logout,
				middlewares: [],
			},
			{
				path: '/refresh',
				method: 'get',
				func: this.refresh,
				middlewares: [],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
				middlewares: [new AuthMiddleware(this.tokenService)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthMiddleware(this.tokenService)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.logger.log('[UserController] Login', body);
		const result = await this.usersService.validate(body);
		if (!result) {
			return next(new HttpError(401, UsersMessages.AuthError, 'Login'));
		}
		res = this.tokenService.save(res, result.jwt.refresh);
		const { jwt, ...userData } = result;
		this.ok(res, { ...userData, jwt: jwt.access }, UsersMessages.AuthSuccess);
	}

	async register(
		{ body }: Request<{}, {}, UserDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.logger.log('[UserController] Register', body);
		const result = await this.usersService.create(body);
		if (!result) {
			return next(new HttpError(422, UsersMessages.UserExists, 'UsersController'));
		}
		this.logger.log(`[UserController] User «${result.email}» registered`);
		const { id, name, email, role } = result;
		this.ok(res, { id, email, name, role: role?.name }, UsersMessages.Registered);
	}

	logout(req: Request, res: Response, next: NextFunction): void {
		res.clearCookie('rf_token');
		this.ok(res, {}, '');
		next();
	}

	async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		const cookies = JSONCookies(req.cookies);
		const token = cookies?.rf_token?.toString();
		if (!token) {
			return next(new HttpError(401, UsersMessages.NeedAuth, 'UsersController'));
		}
		const result = await this.tokenService.refresh(token, res);
		if (result) {
			const { res, ...userData } = result;
			this.ok(res, userData, UsersMessages.TokenRefreshSuccess);
			return;
		}
		next(new HttpError(401, UsersMessages.NeedAuth, 'UsersController'));
	}

	async delete({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		this.logger.log('[UserController] Delete', params.id);
		const result = await this.usersService.delete(parseInt(params.id));
		if (!result) {
			return next(new HttpError(404, UsersMessages.UserNotFound, 'UsersController'));
		}
		this.ok(res, {}, UsersMessages.UserDeleted.replace('%s', params.id));
	}

	async info(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, req.user, '');
		next();
	}
}
