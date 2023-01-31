import { UserDTO } from '../dto/user.dto';
import { TUsersAndRoles } from '../users.roles';
import { TUsersPayloadJWT } from './users.payload';

export interface IUsersService {
	create(user: UserDTO): Promise<TUsersAndRoles | null>;
	validate(user: UserDTO): Promise<TUsersPayloadJWT | null>;
	get(email: string): Promise<TUsersAndRoles | null>;
	delete(id: number): Promise<boolean>;
}
