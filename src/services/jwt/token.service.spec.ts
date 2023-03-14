import 'reflect-metadata';
import { Container } from 'inversify';
import { ITokenService } from './token.service.interface';
import { TYPES } from '../../types';
import { TokenService } from './token.service';
import { TUsersPayload } from '../../users/service/users.payload';
import { User } from '../../users/user.entity';

enum Example {
	password = 'ruqRum7-raqzo95-cogbap',
	secret = 'REFRESH_SECRET',
}

const container = new Container();
let tokenService: TokenService;
let exampleToken: string;

beforeAll(() => {
	container.bind<ITokenService>(TYPES.ITokenService).to(TokenService);
	tokenService = container.get<TokenService>(TYPES.ITokenService);
});

describe('Token Service', () => {
	it('Make [Success]', async () => {
		exampleToken = await tokenService.make(
			{
				id: 25,
				name: 'Alexey',
				email: 'test@test.ru',
				role: 'manager',
			},
			Example.secret,
			'45d',
		);
		expect(exampleToken).not.toBe('');
	});

	it('Check [Success]', async () => {
		const result = tokenService.check(exampleToken, Example.secret);
		expect(result).not.toBe(false);
	});
	it('Check [Error]', async () => {
		const result = tokenService.check(exampleToken, Example.password);
		expect(result).toBe(false);
	});
	it('Generate [By payload, Success]', async () => {
		const user: TUsersPayload = {
			id: 25,
			name: 'Alexey',
			email: 'test@test.ru',
			role: 'manager',
		};
		const result = await tokenService.generate(user);
		expect(result?.access).not.toBe('');
	});
	it('Generate [By User, Success]', async () => {
		const user: User = new User('test@test.ru', 'Alexey', 'manager', 25);
		const result = await tokenService.generate(user);
		expect(result?.access).not.toBe('');
	});
});
