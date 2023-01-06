import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { App } from './app';
import { ConfigService } from './services/config/config.service';
import { IConfigService } from './services/config/config.service.interface';
import { ILoggerService } from './services/logger/logger.service.interface';
import { LoggerService } from './services/logger/logger.service';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UsersController);
});

const bootstrap = async (): Promise<App> => {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return app;
};

export const boot = bootstrap();