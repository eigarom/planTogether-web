const request = require('supertest');
const app = require('../../app');
const UserAccountServices = require('../../services/UserAccountServices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../services/UserAccountServices');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Test auth Router', () => {
	describe('POST /login', () => {
		it('should return 400 for invalid email', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({email: 'invalid-email', password: 'StrongPassword1*'})
				.expect(400);

			expect(response.body.message).toContain('"email"');
		});

		it('should return 400 for invalid password', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'short'})
				.expect(400);

			expect(response.body.message).toContain('"password"');
		});

		it('should return a token for valid credentials', async () => {
			const mockUser = {
				email: 'test@example.com',
				password: 'StrongPassword1*',
				userId: 'userId',
				familyId: 'familyId'
			};

			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(mockUser);
			bcrypt.compare.mockResolvedValue(true);
			jwt.sign.mockReturnValue('mockToken');

			const response = await request(app)
				.post('/auth/login')
				.send({email: 'test@example.com', password: 'StrongPassword1*'})
				.expect(200);

			expect(response.body.token).toEqual('mockToken');
		});

		it('should return 401 for invalid credentials', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(undefined);

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