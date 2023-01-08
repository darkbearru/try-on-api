import { User } from '../user.entity';
import { UsersAndRoles } from '../users.roles';

export interface IUsersRepository {
	create: (user: User) => Promise<UsersAndRoles | null>;
	find: (email: string) => Promise<UsersAndRoles | null>;
	delete: (id: number) => Promise<boolean>;
}
