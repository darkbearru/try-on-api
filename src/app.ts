import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import express, { Express } from 'express';
import { TYPES } from './types';
import { ILoggerService } from './services/logger/logger.service.interface';
import 'reflect-metadata';
import { UsersController } from './users/users.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import cookieParser from 'cookie-parser';

@injectable()
export class App {
	app: Express;
	private port = 8900;
	private server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private usersController: UsersController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
	}
	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();

		await this.prismaService.connect();

		this.port = parseInt(process.env.PORT || String(this.port));
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`[App] Сервер запущен на http://localhost:${this.port}/`);
		});
	}
	public close(): void {
		this.server.close();
	}

	protected useRoutes() {
		this.app.use('/users', this.usersController.router);
	}

	protected useMiddlewares() {
		this.app.use(cookieParser());
		this.app.use(express.json());
	}

	protected useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
