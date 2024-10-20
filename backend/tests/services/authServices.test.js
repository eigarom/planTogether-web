const app = require('../../src/app');
const AuthServices = require('../../src/services/AuthServices');
const UserAccountServices = require('../../src/services/UserAccountServices');
const authUtils = require('../../src/utils/authUtils');
const HttpError = require("../../src/middlewares/error/HttpError");

jest.mock('../../src/services/UserAccountServices');
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
			mockToken = 'mockToken';
			expectedToken = mockToken;

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
});