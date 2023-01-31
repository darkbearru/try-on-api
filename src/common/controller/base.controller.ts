import { Response, Router } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IController } from './controller.interface';
import { ILoggerService } from '../../services/logger/logger.service.interface';
import { IControllerRoute } from './controller.route.interface';

@injectable()
export abstract class BaseController implements IController {
	private readonly _router: Router;

	constructor(protected logger: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, body: T, message: string): Response {
		res.type('application/json');
		return res.status(code).send({ ...body, message });
	}

	public ok<T>(res: Response, body: T, message: string): Response {
		return this.send<T>(res, 200, body, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[Bind Routes] ${route.method.toUpperCase()} => ${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this._router[route.method](route.path, pipeline);
		}
	}
}
