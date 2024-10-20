const request = require('supertest');
const app = require('../../src/app');
const UserAccountServices = require('../../src/services/UserAccountServices');
const AuthServices = require('../../src/services/AuthServices');

jest.mock('../../src/services/UserAccountServices');
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

		it('should return a token for valid credentials', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(mockUser);
			AuthServices.isValidPassword.mockResolvedValue(true);
			AuthServices.generateToken.mockReturnValue('mockToken');

			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(200);

			expect(response.body.token).toEqual('mockToken');
		});

		it('should return 401 for invalid email', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(undefined);

			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(401);

			expect(response.body.message).toEqual('Identifiants invalides');
		});

		it('should return 401 for invalid password', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(mockUser);
			AuthServices.isValidPassword.mockResolvedValue(false);

			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(401);

			expect(response.body.message).toEqual('Identifiants invalides');
		});

		it('should return 500 for server errors', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockRejectedValue(new Error());

			await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(500);
		});
	});
});