import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http-error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ILoggerService } from '../services/logger/logger.service.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILoggerService) protected logger: ILoggerService) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context || 'HttpError'}] Ошибка ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ error: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ error: err.message });
		}
		next();
	}
}
