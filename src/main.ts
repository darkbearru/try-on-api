import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { App } from './app';
import { ILoggerService } from './services/logger/logger.service.interface';
import { LoggerService } from './services/logger/logger.service';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';
import { IUsersRepository } from './users/repository/users.repository.interface';
import { UsersRepository } from './users/repository/users.repository';
import { PrismaService } from './database/prisma.service';
import { IUsersService } from './users/service/users.service.interface';
import { UsersService } from './users/service/users.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { ITokenService } from './services/jwt/token.service.interface';
import { TokenService } from './services/jwt/token.service';

export const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<ITokenService>(TYPES.ITokenService).to(TokenService).inSingletonScope();
	bind<IUsersService>(TYPES.IUsersService).to(UsersService).inSingletonScope();
	bind<IUsersController>(TYPES.IUsersController).to(UsersController);
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
});

const bootstrap = async (): Promise<App> => {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return app;
};

export const boot = bootstrap();
