import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { App } from './app';
import { ConfigService } from './services/config/config.service';
import { IConfigService } from './services/config/config.service.interface';
import { ILoggerService } from './services/logger/logger.service.interface';
import { LoggerService } from './services/logger/logger.service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
});

const bootstrap = async (): Promise<App> => {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return app;
};

export const boot = bootstrap();