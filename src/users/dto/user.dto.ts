import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TUserRoles, UserRoles, userRolesList } from '../users.roles';
export class UserDTO
{
	@IsEmail({}, { message: 'Неуказан или указан неверно Email'})
	email: string;

	@MinLength(5, { message: 'Минимальная длина пароля 5 символов'})
	@IsString({ message: 'Неуказан пароль'})
	password: string;

	@MinLength(3, { message: 'Минимальная длина имени 3 символа'})
	@IsString({ message: 'Имя пользователя должно быть строкой'})
	@IsOptional()
	name?: string;

	@IsEnum(UserRoles, { message: `Роль пользователя должна принимать значение: ${userRolesList}`})
	@IsOptional()
	role?: TUserRoles;
}