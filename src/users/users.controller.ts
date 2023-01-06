import { BaseController } from '../common/controller/base.controller';
import { IUsersController } from './users.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILoggerService } from '../services/logger/logger.service.interface';
import { IConfigService } from '../services/config/config.service.interface';
import { Request, Response, NextFunction } from 'express';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { UserDTO } from './dto/user.dto';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserDTO)],
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
	}

	register({ body }: Request<{}, {}, UserDTO>, res: Response, next: NextFunction): void {
		this.logger.log('[UserController] Register', body);
		this.ok(res, body, 'Регистрация успешна');
		next();
	}

	logout(req: Request, res: Response, next: NextFunction): void {
	}

	activate(req: Request, res: Response, next: NextFunction): void {
	}

	refresh(req: Request, res: Response, next: NextFunction): void {
	}
}
