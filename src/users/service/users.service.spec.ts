import 'reflect-metadata';
import { Container } from 'inversify';
import { IUsersRepository } from '../repository/users.repository.interface';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../../types';
import { UsersService } from './users.service';
import { TUsersAndRoles } from '../users.roles';
import { User } from '../user.entity';
import { ITokenService } from '../../services/jwt/token.service.interface';

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
	delete: jest.fn(),
};
const TokenServiceMock: ITokenService = {
	make: jest.fn(),
	generate: jest.fn(),
	check: jest.fn(),
	save: jest.fn(),
	refresh: jest.fn(),
};

const container = new Container();
let usersRepository: IUsersRepository;
let usersService: IUsersService;
let tokenService: ITokenService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.IUsersService).to(UsersService);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);
	container.bind<ITokenService>(TYPES.ITokenService).toConstantValue(TokenServiceMock);

	usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
	usersService = container.get<IUsersService>(TYPES.IUsersService);
	tokenService = container.get<ITokenService>(TYPES.ITokenService);
});

let createdUser: TUsersAndRoles | null;

describe('User Service', () => {
	it('Create User [Success]', async () => {
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): TUsersAndRoles => ({
				id: 25,
				name: user.name,
				email: user.email,
				password: user.password,
				roleId: 2,
				createdAt: new Date(),
				changedAt: new Date(),
				role: {
					id: 2,
					name: 'manager',
				},
			}),
		);
		createdUser = await usersService.create({
			name: 'Alexey',
			email: 'test@test.ru',
			password: '12345',
			role: 'manager',
		});
		expect(createdUser?.id).toEqual(25);
		expect(createdUser?.password).not.toEqual('1');
	});
	it('Create User [Error]', async () => {
		usersRepository.create = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.create({
			name: 'Alexey',
			email: 'test@test.ru',
			password: '12345',
			role: 'manager',
		});
		expect(result).toBeNull();
	});
	it('Validate User [Success]', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validate({
			email: 'test@test.ru',
			password: '12345',
		});
		expect(result).not.toBeNull();
	});
	it('Validate User [Error, Wrong Password]', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validate({
			email: 'a.abramenko@chita.ru',
			password: '1234',
		});
		expect(result).toBeNull();
	});
	it('Validate User [Error, Wrong User]', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validate({
			email: 'a.abramenko@chita.ru',
			password: '12345',
		});
		expect(result).toBeNull();
	});
	it('Get User [Success]', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.get('a.abramenko@chita.ru');
		expect(result?.id).toEqual(25);
	});
	it('Get User [Error]', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.get('a.abramenko@chita.ru');
		expect(result).toBeNull();
	});
	it('Delete User [Success]', async () => {
		usersRepository.delete = jest.fn().mockReturnValueOnce(true);
		const result = await usersService.delete(25);
		expect(result).toBeTruthy();
	});
	it('Delete User [Error]', async () => {
		usersRepository.delete = jest.fn().mockReturnValueOnce(false);
		const result = await usersService.delete(25);
		expect(result).not.toBeTruthy();
	});
});
