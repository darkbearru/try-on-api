export enum UserRoles {
	'admin'= 'admin',
	'manager' = 'manager'
}
export type TUserRoles = keyof typeof UserRoles;

export const userRolesList: string = `«${Object.keys(UserRoles).join('», «')}»`;