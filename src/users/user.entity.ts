import { compare, hash } from 'bcryptjs';
import { TUserRoles } from './users.roles';
import { TUsersPayload } from './service/users.payload';

export class User {
	constructor(
		private readonly _email: string,
		private readonly _name?: string | null,
		private readonly _role: TUserRoles = 'manager',
		private readonly _id?: number,
		passwordHash?: string,
	) {
		if (passwordHash) this._password = passwordHash;
	}

	private _password: string;

	get password(): string {
		return this._password;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name || '';
	}
	get role(): string {
		return this._role;
	}

	get payload(): TUsersPayload {
		return {
			name: this.name,
			email: this._email,
			id: this._id,
			role: this._role,
		};
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return await compare(pass, this._password);
	}
}
