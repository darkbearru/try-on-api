import { Container } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from './config.service.interface';
import { TYPES } from '../../types';
import { ConfigService } from './config.service';
import { ILoggerService } from '../logger/logger.service.interface';
import { LoggerService } from '../logger/logger.service';


const container = new Container();
let configService: IConfigService;


beforeAll(() => {
	container.bind<IConfigService>(TYPES.IConfigService).to(ConfigService);
	container.bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
});

describe('Config Service', () => {
	it('Get [Success]', () => {
		const port: number = Number(configService.get<number>('PORT'));
		expect(port).toBe(8900);
	});
	it('Get [Error]', () => {
		const port: number = configService.get('PORT2');
		expect(port).toBeUndefined();
	});
	it('Get [Default]', () => {
		const port: number = configService.get('PORT2', 9000);
		expect(port).toBe(9000);
	});
});