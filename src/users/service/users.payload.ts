import { TUserRoles } from '../users.roles';
import { TTokensList } from '../../services/jwt/token.service.interface';

export type TUsersPayload = {
	email: string;
	id?: number;
	name?: string;
	role?: TUserRoles;
};

export type TUsersPayloadJWT = TUsersPayload & { jwt: TTokensList };
