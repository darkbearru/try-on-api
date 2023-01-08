import 'reflect-metadata';
import { Container } from 'inversify';
import { ITokenService } from './token.service.interface';
import { TYPES } from '../../types';
import { TokenService } from './token.service';
import { TUsersPayload } from '../../users/service/users.payload';
import { User } from '../../users/user.entity';

const container = new Container();
let tokenService: TokenService;

beforeAll(() => {
	container.bind<ITokenService>(TYPES.ITokenService).to(TokenService);
	tokenService = container.get<TokenService>(TYPES.ITokenService);
});

describe('Token Service', () => {
	it('Check [Success]', async () => {
		const result = tokenService.check(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleGV5IiwiZW1haWwiOiJhLmFicmFtZW5rb0BjaGl0YS5ydSIsImlkIjo2LCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3MzE1MzM2MCwiZXhwIjoxNjc3MDQxMzYwfQ.8PHC94gPQ8L0Tup6A3pGupvjV-2j8pMw56ZBB41bZmA',
			'ruqRum7-raqzo95-cogbap',
		);
		expect(result).not.toBe('');
	});
	it('Check [Error]', async () => {
		const result = tokenService.check(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleGV5IiwiZW1haWwiOiJhLmFicmFtZW5rb0BjaGl0YS5ydSIsImlkIjo2LCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3MzE1MzM2MCwiZXhwIjoxNjc3MDQxMzYwfQ.8PHC94gPQ8L0Tup6A3pGupvjV-2j8pMw56ZBB41bZmA',
			'REFRESH_SECRET',
		);
		expect(result).toBe('');
	});
	it('Make [Success]', async () => {
		const result = await tokenService.make(
			{
				id: 25,
				name: 'Alexey',
				email: 'test@test.ru',
				role: 'manager',
			},
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleGV5IiwiZW1haWwiOiJhLmFicmFtZW5rb0BjaGl0YS5ydSIsImlkIjo2LCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3MzE1MzM2MCwiZXhwIjoxNjc3MDQxMzYwfQ.8PHC94gPQ8L0Tup6A3pGupvjV-2j8pMw56ZBB41bZmA',
			'45d',
		);
		expect(result).not.toBe('');
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
