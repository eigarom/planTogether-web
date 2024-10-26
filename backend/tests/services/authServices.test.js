const AuthServices = require('../../src/services/AuthServices');
const UserAccountQueries = require('../../src/queries/UserAccountQueries');
const UserAccountServices = require('../../src/services/UserAccountServices');
const authUtils = require('../../src/utils/authUtils');
const HttpError = require("../../src/middlewares/error/HttpError");

jest.mock('../../src/services/UserAccountServices');
jest.mock('../../src/queries/UserAccountQueries');
jest.mock('../../src/utils/authUtils');


const mockUser = {
	email: 'test@example.com',
	password: 'StrongPassword1*',
	userId: 'userId',
	familyId: 'familyId'
};

describe('Test authentification services', () => {
	describe('login', () => {
		it('should return a token for valid credentials', async () => {
			const mockToken = 'mockToken';
			const expectedToken = mockToken;

			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(mockUser);
			authUtils.isValidPassword.mockResolvedValue(true);
			authUtils.generateToken.mockReturnValue(mockToken);

			const token = await AuthServices.login('email', 'password');
			expect(token).toEqual(expectedToken);
		});

		it('should return 401 for invalid email', async () => {
			const expectedError = new HttpError(401, `Identifiants invalides`);

			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(undefined);

			await expect(AuthServices.login('email', 'password')).rejects.toThrow(expectedError);
		});

		it('should return 401 for invalid password', async () => {
			const expectedError = new HttpError(401, `Identifiants invalides`);

			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue('user');
			authUtils.isValidPassword.mockResolvedValue(false);

			await expect(AuthServices.login('email', 'password')).rejects.toThrow(expectedError);
		});
	});

	describe('register', () => {
		it('should throw 401 if email is already taken', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(true);

			await expect(AuthServices.register('test@example.com', 'StrongPassword1*', 'Test User'))
				.rejects
				.toThrow(new HttpError(401, 'Courriel non disponible'));
		});

		it('should return a token for successful registration', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(null);
			authUtils.hashPassword.mockResolvedValue('hashedPassword');
			UserAccountQueries.insertUserAccount.mockResolvedValue('newUserId');
			authUtils.generateToken.mockReturnValue('mockToken');

			const token = await AuthServices.register('test@example.com', 'StrongPassword1*', 'Test User');
			expect(token).toEqual('mockToken');
		});

		it('should throw an error if inserting user account fails', async () => {
			UserAccountServices.getUserCredentialsByEmail.mockResolvedValue(null);
			authUtils.hashPassword.mockResolvedValue('hashedPassword');
			UserAccountQueries.insertUserAccount.mockRejectedValue(new Error('Insert failed'));

			await expect(AuthServices.register('test@example.com', 'StrongPassword1*', 'Test User'))
				.rejects
				.toThrow('Insert failed');
		});
	});
});