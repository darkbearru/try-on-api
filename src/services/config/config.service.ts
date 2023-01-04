import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
	) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует');
		} else {
			this.logger.error('[ConfigService] Конфигурация .env загружена');
		}
		this.config = result.parsed as DotenvParseOutput;
	}
	get<T>(key: string): T;
	get<T>(key: string, defaultValue?: T): T {
		const value = this.config[key];
		if (!value && defaultValue) return defaultValue;
		return value as T;
	}

}