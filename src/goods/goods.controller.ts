import { inject, injectable } from 'inversify';
import { BaseController } from '../common/controller/base.controller';
import { IGoodsController } from './goods.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../types';
import { ILoggerService } from '../services/logger/logger.service.interface';
import { ITokenService } from '../services/jwt/token.service.interface';

@injectable()
export class GoodsController extends BaseController implements IGoodsController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/add',
				method: 'post',
				func: this.add,
				middlewares: [],
			},
			{
				path: '/:slug',
				method: 'get',
				func: this.list,
				middlewares: [],
			},
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
				middlewares: [],
			},
			{
				path: '/:id',
				method: 'patch',
				func: this.update,
				middlewares: [],
			},
		]);
	}

	add(req: Request, res: Response, next: NextFunction): void {
		next();
	}

	delete(req: Request, res: Response, next: NextFunction): void {
		next();
	}

	list(req: Request, res: Response, next: NextFunction): void {
		next();
	}

	update(req: Request, res: Response, next: NextFunction): void {
		next();
	}
}
