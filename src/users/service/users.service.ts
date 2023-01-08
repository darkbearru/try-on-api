import { IUsersService } from './users.service.interface';
import { UserDTO } from '../dto/user.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IUsersRepository } from '../repository/users.repository.interface';
import { User } from '../user.entity';
import { TUserRoles, TUsersAndRoles } from '../users.roles';
import { ITokenService } from '../../services/jwt/token.service.interface';
import { TUsersPayloadJWT } from './users.payload';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.IUsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
	) {}

	async create({ name, email, role, password }: UserDTO): Promise<TUsersAndRoles | null> {
		const newUser = new User(email, name, role);
		const salt = process.env.SALT || 10;
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.get(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	delete(id: number): Promise<boolean> {
		return this.usersRepository.delete(id);
	}

	async get(email: string): Promise<TUsersAndRoles | null> {
		return await this.usersRepository.find(email);
	}

	async validate({ email, password }: UserDTO): Promise<TUsersPayloadJWT | null> {
		const existedUser = await this.get(email);
		if (!existedUser) return null;
		const role: TUserRoles | undefined = existedUser?.role?.name as TUserRoles;
		const newUser = new User(
			existedUser.email,
			existedUser.name,
			role,
			existedUser.id,
			existedUser.password,
		);
		const validatePassword = await newUser.comparePassword(password);
		if (!validatePassword) return null;

		return {
			...newUser.payload,
			jwt: await this.tokenService.generate(newUser),
		};
	}
}
