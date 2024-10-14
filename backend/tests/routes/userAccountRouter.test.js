const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/auth/authMiddleware', () => jest.fn((req, res, next) => {
	req.user = {
		email: 'email',
		userId: 'mockUserId',
		familyId: 'familyId'
	};
	next();
}));

jest.mock('../../src/services/UserAccountServices');
const mockUserAccountServices = require('../../src/services/UserAccountServices');

describe('Tests routes', () => {

	describe('GET /users/me', () => {
		it('should return user informations in json with code 200', async () => {
			const mockUserDetails = {
				email: 'email',
				name: 'name',
				color: 'color',
				imageContent: 'imageContent',
				imageContentType: 'imageContentType',
				lang: 'lang',
				theme: 'theme'
			};

			mockUserAccountServices.getUserById.mockResolvedValue(mockUserDetails);

			const response = await request(app)
				.get('/users/me')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(response.body).toEqual(mockUserDetails);
		});

		it('throws return code 404 if user not found', async () => {
			mockUserAccountServices.getUserById.mockResolvedValue(undefined);

			const response = await request(app)
				.get('/users/me')
				.expect(404)

			expect(response.body.message).toEqual('Utilisateur introuvable');
		});

		it('should return 500 if service fails', async () => {
			mockUserAccountServices.getUserById.mockRejectedValue(new Error());

			const response = await request(app)
				.get('/users/me')
				.expect(500);
		});
	});
});

