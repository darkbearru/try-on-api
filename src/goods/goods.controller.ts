import { inject, injectable } from 'inversify';
import { BaseController } from '../common/controller/base.controller';
import { IGoodsController } from './goods.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../types';
import { ILoggerService } from '../services/logger/logger.service.interface';
import { ITokenService } from '../services/jwt/token.service.interface';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { GoodsDTO } from './dto/goods.dto';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

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
				middlewares: [
					new ValidateMiddleware(GoodsDTO),
					new AuthMiddleware(this.tokenService, 'admin'),
				],
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
			{
				path: '/count/:count',
				method: 'patch',
				func: this.updateCount,
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

	updateCount(req: Request, res: Response, next: NextFunction): void {
		next();
	}
}
