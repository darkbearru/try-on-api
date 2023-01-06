import { inject, injectable } from 'inversify';
import { Server } from 'node:http';
import express, { Express } from 'express';
import { TYPES } from './types';
import { ILoggerService } from './services/logger/logger.service.interface';
import { IConfigService } from './services/config/config.service.interface';
import 'reflect-metadata';
import { UsersController } from './users/users.controller';


@injectable()
export class App {
	app: Express;
	private port: number = 8900;
	private server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IUsersController) private usersController: UsersController,
		@inject(TYPES.IConfigService) private config: IConfigService,
	) {
		this.app = express();
	}
	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		this.port = this.config.get('PORT', this.port);
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
		this.app.use(express.json());
	}

	protected useExceptionFilters() {

	}
}