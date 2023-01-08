import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { User } from '../user.entity';
import { IUsersRepository } from './users.repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { Users, UsersRole } from '@prisma/client';
import { TUsersAndRoles } from '../users.roles';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name, role }: User): Promise<TUsersAndRoles | null> {
		const rl: UsersRole | null = await this.prismaService.client.usersRole.findFirst({
			where: {
				name: role,
			},
		});
		return this.prismaService.client.users.create({
			include: {
				role: true,
			},
			data: {
				email,
				password,
				name,
				role: {
					connectOrCreate: {
						create: {
							name: role,
						},
						where: {
							id: rl?.id || 0,
						},
					},
				},
			},
		});
	}

	find(email: string): Promise<TUsersAndRoles | null> {
		return this.prismaService.client.users.findFirst({
			include: {
				role: true,
			},
			where: {
				email,
			},
		});
	}

	async delete(id: number): Promise<boolean> {
		let res: Users | undefined;
		try {
			res = await this.prismaService.client.users.delete({
				where: {
					id,
				},
			});
		} catch (e) {
			res = undefined;
		}
		return !!res;
	}
}
