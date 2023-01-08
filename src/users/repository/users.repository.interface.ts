import { User } from '../user.entity';
import { TUsersAndRoles } from '../users.roles';

export interface IUsersRepository {
	create: (user: User) => Promise<TUsersAndRoles | null>;
	find: (email: string) => Promise<TUsersAndRoles | null>;
	delete: (id: number) => Promise<boolean>;
}
