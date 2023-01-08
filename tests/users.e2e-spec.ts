import { boot } from '../src/main';
import { App } from '../src/app';
import request from 'supertest';

let application: App;
let userId: number;
let jwt: string;
let cookies: string;

beforeAll(async () => {
	application = await boot;
});

describe('Users End 2 End', () => {
	it('Register [Ok]', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@test.ru',
			password: '12345',
			name: 'Test User',
			role: 'manager',
		});
		userId = res?.body?.id;
		expect(res?.body?.message).toBe('Пользователь зарегистрирован');
	});
	it('Register [Error, Bad name]', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@test.ru',
			password: '12345',
			name: 'Te',
			role: 'manager2',
		});
		expect(res.statusCode).toBe(422);
	});
	it('Register [Error, Bad Role]', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@test.ru',
			password: '12345',
			name: 'Test User',
			role: 'manager2',
		});
		expect(res.statusCode).toBe(422);
	});
	it('Login [Error]', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(401);
	});
	it('Login [Ok]', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: '12345',
		});
		expect(res.statusCode).toBe(200);
		expect(res?.body?.jwt).not.toBeUndefined();
		jwt = res?.body?.jwt;
		cookies = res.headers['set-cookie'];
	});
	it('Refresh [Success]', async () => {
		const res = await request(application.app)
			.get('/users/refresh')
			.set('Cookie', [...cookies])
			.send();
		expect(res.statusCode).toBe(200);
	});
	it('Refresh [Error]', async () => {
		const res = await request(application.app).get('/users/refresh').send();
		expect(res.statusCode).toBe(401);
	});
	it('Delete [Error, Not Authorized]', async () => {
		const res = await request(application.app).delete('/users/122215').send();
		expect(res.statusCode).toBe(401);
	});
	it('Delete [Error]', async () => {
		const res = await request(application.app)
			.delete('/users/122215')
			.set('Authorization', 'Bearer ' + jwt)
			.send();
		expect(res.statusCode).toBe(404);
	});
	it('Delete [Ok]', async () => {
		const res = await request(application.app)
			.delete(`/users/${userId}`)
			.set('Authorization', 'Bearer ' + jwt)
			.send();
		expect(res.statusCode).toBe(200);
	});
});

afterAll(() => {
	application.close();
});
