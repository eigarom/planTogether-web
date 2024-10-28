const UserAccountServices = require('../../src/services/UserAccountServices');

jest.mock('../../src/queries/UserAccountQueries');
const mockUserAccountQueries = require('../../src/queries/UserAccountQueries');

describe('Test user account services', () => {
	describe('getUserById', () => {
		it('should return user informations with valid user Id', async () => {
			const mockUserDetails = {
				id: 'userId',
				email: 'email',
				name: 'name',
				color: 'color',
				lang: 'lang',
				theme: 'theme'
			};
			const expectUserDetails = mockUserDetails;

			mockUserAccountQueries.getUserByID.mockResolvedValue(mockUserDetails);

			const userDetails = await UserAccountServices.getUserById('userId');
			expect(userDetails).toEqual(expectUserDetails);
		});

		it('should return "undefined" if user id not found ', async () => {
			mockUserAccountQueries.getUserByID.mockResolvedValue(undefined);
			const userDetails = await UserAccountServices.getUserById('userId');
			expect(userDetails).toBeUndefined();
		});
	});

	describe('getUserCredentialsByEmail', () => {
		it('should return user credentials with valid email', async () => {
			const mockUserCredentials = {
				email: 'email',
				password_hash: 'hashedPassword',
				id_member: 'userId',
				id_family: 'familyId'
			};
			const expectUserCredentials = {
				email: 'email',
				password: 'hashedPassword',
				userId: 'userId',
				familyId: 'familyId'
			};

			mockUserAccountQueries.getUserCredentialsByEmail.mockResolvedValue(mockUserCredentials);

			const userCredentials = await UserAccountServices.getUserCredentialsByEmail('email');
			expect(userCredentials).toEqual(expectUserCredentials);
		});

		it('should return "undefined" if user email not found ', async () => {
			mockUserAccountQueries.getUserCredentialsByEmail.mockResolvedValue(undefined);
			const userDetails = await UserAccountServices.getUserCredentialsByEmail('email');
			expect(userDetails).toBeUndefined();
		});
	});

	describe('updateUser', () => {
		it('should update user information and return the updated user', async () => {
			const mockUserDetails = {
				id: 'userId',
				email: 'newemail@example.com',
				name: 'newname',
				color: 'newcolor',
				lang: 'newlang',
				theme: 'newtheme'
			};

			const expectedUserDetails = mockUserDetails;

			mockUserAccountQueries.updateUser.mockResolvedValue();
			mockUserAccountQueries.getUserByID.mockResolvedValue(mockUserDetails);

			const updatedUser = await UserAccountServices.updateUser(mockUserDetails);
			expect(updatedUser).toEqual(expectedUserDetails);
		});
	});
});