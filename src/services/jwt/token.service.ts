import { ITokenService } from './token.service.interface';
import { TUsersPayload } from '../../users/service/users.payload';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { User } from '../../users/user.entity';
import { injectable } from 'inversify';
import { Response } from 'express';
import ms from 'ms';
import { TRefreshResponse, TTokensList } from './token.types';

@injectable()
export class TokenService implements ITokenService {
	private readonly refreshSecret: string;
	private readonly refreshLifetime: string;
	private readonly accessSecret: string;
	private readonly accessLifetime: string;

	constructor() {
		this.accessSecret = process.env.JWT_ACCESS_SECRET || 'SECRET';
		this.accessLifetime = process.env.JWT_ACCESS_LIFETIME || '30m';
		this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET';
		this.refreshLifetime = process.env.JWT_REFRESH_LIFETIME || '30d';
	}

	check(token: string, secret: string): JwtPayload | string {
		try {
			return verify(token, secret);
		} catch (e) {
			return '';
		}
	}

	make(payload: TUsersPayload, secret: string, expiresIn: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				payload,
				secret,
				{
					algorithm: 'HS256',
					expiresIn,
				},
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				},
			);
		});
	}

	async generate(user: User | TUsersPayload): Promise<TTokensList> {
		const payload = user instanceof User ? user.payload : user;
		return {
			access: await this.make(payload, this.accessSecret, this.accessLifetime),
			refresh: await this.make(payload, this.refreshSecret, this.refreshLifetime),
		};
	}

	save(res: Response, token: string): Response {
		res.cookie('rf_token', token, {
			httpOnly: true,
			maxAge: ms(this.refreshLifetime),
		});
		return res;
	}

	async refresh(token: string, res: Response): Promise<TRefreshResponse | null> {
		const data = await this.check(token, process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET');
		if (typeof data !== 'string') {
			const { exp, iat, ...userData } = data;
			const payload: TUsersPayload = userData as TUsersPayload;
			const jwt = await this.generate(payload);
			res = this.save(res, jwt.refresh);
			return { ...payload, jwt: jwt.access, res };
		}
		return null;
	}
}
