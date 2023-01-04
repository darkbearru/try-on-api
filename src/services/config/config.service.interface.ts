export interface IConfigService {
	get: <T>(key: string, defaultValue?: T) => T;
	// get: <T>(key: string, defaultValue?: T) => T;
}