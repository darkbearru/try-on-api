import { Users, UsersRole } from '@prisma/client';

export enum UserRoles {
	'admin' = 'admin',
	'manager' = 'manager',
}
export type TUserRoles = keyof typeof UserRoles;

export const userRolesList = `«${Object.keys(UserRoles).join('», «')}»`;

export type TUsersAndRoles = Users & { role?: UsersRole };
