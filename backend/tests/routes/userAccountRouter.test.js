const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/middlewares/auth/authMiddleware', () => jest.fn((req, res, next) => {
	req.user = {
		email: 'email',
		userId: 'userId',
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
				id: 'userId',
				email: 'email',
				name: 'name',
				color: 'color'
			};

			const expectedUserDetails = mockUserDetails;

			mockUserAccountServices.getUserById.mockResolvedValue(mockUserDetails);

			const response = await request(app)
				.get('/users/me')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(response.body).toEqual(expectedUserDetails);
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

			await request(app)
				.get('/users/me')
				.expect(500);
		});
	});

	describe('PUT /users/me', () => {
		it('should update user informations and return updated user in json with code 200', async () => {
			const mockUserDetails = {
				id: 'userId',
				email: 'newemail@example.com',
				name: 'newname',
				color: '#ab1234'
			};
			const expectedUserDetails = mockUserDetails;

			mockUserAccountServices.getUserById.mockResolvedValue(mockUserDetails);
			mockUserAccountServices.updateUser.mockResolvedValue(mockUserDetails);

			const response = await request(app)
				.put('/users/me')
				.send({
					email: 'email@example.com',
					name: 'name',
					color: '#ff0000'
				})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(expectedUserDetails);
		});

		it('should return 400 if validation fails', async () => {
			const response = await request(app)
				.put('/users/me')
				.send({
					email: 'invalidemail',
					name: 'newname',
					color: 'newcolor'
				})
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 404 if user not found', async () => {
			mockUserAccountServices.getUserById.mockResolvedValue(undefined);

			const response = await request(app)
				.put('/users/me')
				.send({
					email: 'newemail@example.com',
					name: 'newname',
					color: '#ff0000'
				})
				.expect(404);

			expect(response.body.message).toEqual('Utilisateur introuvable');
		});

		it('should return 500 if service fails', async () => {
			mockUserAccountServices.getUserById.mockRejectedValue(new Error());

			await request(app)
				.put('/users/me')
				.send({
					email: 'newemail@example.com',
					name: 'newname',
					color: '#ff0000'
				})
				.expect(500);
		});
	});

	describe('DELETE /users/me', () => {
		it('should delete the user and return a 200 status code', async () => {
			const mockUserDetails = {
				id: 'userId',
				email: 'email',
				name: 'name',
				color: 'color'
			}

			mockUserAccountServices.getUserById.mockResolvedValue(mockUserDetails);

			const response = await request(app)
				.delete('/users/me')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return a 404 status code if the user is not found', async () => {
			mockUserAccountServices.getUserById.mockResolvedValue(undefined);

			const response = await request(app)
				.delete('/users/me')
				.expect(404);

			expect(response.body.message).toEqual('Utilisateur introuvable');
		});

		it('should return a 500 status code if the service fails', async () => {
			mockUserAccountServices.getUserById.mockRejectedValue(new Error());

			await request(app)
				.delete('/users/me')
				.expect(500);
		});
	});
});

