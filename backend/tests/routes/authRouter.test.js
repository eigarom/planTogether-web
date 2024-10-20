const request = require('supertest');
const app = require('../../src/app');
const AuthServices = require('../../src/services/AuthServices');

jest.mock('../../src/services/AuthServices');

const mockUser = {
	email: 'test@example.com',
	password: 'StrongPassword1*',
	userId: 'userId',
	familyId: 'familyId'
};

describe('Test auth Router', () => {
	describe('POST /login', () => {
		it('should return 400 for invalid email', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({email: 'invalid-email', password: 'password'})
				.expect(400);

			expect(response.body.message).toContain('"email"');
		});

		it('should return 400 for empty password', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: ''})
				.expect(400);

			expect(response.body.message).toContain('"password"');
		});

		it('should return a token with successful login', async () => {
			AuthServices.login.mockReturnValue('mockToken');

			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(200);

			expect(response.body.token).toEqual('mockToken');
		});

		it('should return 500 for server errors', async () => {
			AuthServices.login.mockRejectedValue(new Error());

			await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(500);
		});
	});

	describe('POST /register', () => {
		it('should return 400 for invalid email', async () => {
			const response = await request(app)
				.post('/auth/register')
				.send({email: 'invalid-email', password: 'password', name: 'Test User'})
				.expect(400);

			expect(response.body.message).toContain('"email"');
		});

		it('should return 400 for invalid password', async () => {
			const response = await request(app)
				.post('/auth/register')
				.send({email: 'test@example.com', password: 'invalid-password', name: 'Test User'})
				.expect(400);

			expect(response.body.message).toContain('Le mot de passe doit contenir au moins 16 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
		});

		it('should return 400 for empty name', async () => {
			const response = await request(app)
				.post('/auth/register')
				.send({email: 'test@example.com', password: 'StrongPassword1*', name: ''})
				.expect(400);

			expect(response.body.message).toContain('"name"');
		});

		it('should return a token with successful registration', async () => {
			AuthServices.register.mockReturnValue('mockToken');

			const response = await request(app)
				.post('/auth/register')
				.send({email: 'test@example.com', password: 'StrongPassword1*', name: 'Test User'})
				.expect(200);

			expect(response.body.token).toEqual('mockToken');
		});

		it('should return 500 for server errors', async () => {
			AuthServices.register.mockRejectedValue(new Error());

			await request(app)
				.post('/auth/register')
				.send({email: 'test@example.com', password: 'StrongPassword1*', name: 'Test User'})
				.expect(500);
		});
	});
});