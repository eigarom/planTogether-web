const UserAccountServices = require('../../src/services/UserAccountServices');

jest.mock('../../src/queries/UserAccountQueries');
const mockUserAccountQueries = require('../../src/queries/UserAccountQueries');
const mockMemberQueries = require('../../src/queries/MemberQueries');
const mockFamilyServices = require('../../src/services/FamilyServices');

describe('Test user account services', () => {
	describe('getUserById', () => {
		it('should return user informations with valid user Id', async () => {
			const mockUserDetails = {
				id: 'userId',
				email: 'email',
				name: 'name',
				color: 'color'
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
				color: 'newcolor'
			};

			const expectedUserDetails = mockUserDetails;

			mockUserAccountQueries.updateUser.mockResolvedValue();
			mockUserAccountQueries.getUserByID.mockResolvedValue(mockUserDetails);

			const updatedUser = await UserAccountServices.updateUser(mockUserDetails);
			expect(updatedUser).toEqual(expectedUserDetails);
		});
	});

	describe('deleteUser', () => {
		const userId = 1;
		const familyId = 1;

		beforeEach(() => {
			mockMemberQueries.deleteMember = jest.fn();
			mockFamilyServices.deleteFamilyIfNoAccountMembers = jest.fn();
		});

		it('should delete the user and not throw an error', async () => {
			mockUserAccountQueries.getUserByID.mockResolvedValue(undefined);

			await expect(UserAccountServices.deleteUser(userId, familyId)).resolves.not.toThrow();
		});

		it('should throw an error if the user is not deleted', async () => {
			mockMemberQueries.deleteMember.mockResolvedValue();
			mockUserAccountQueries.getUserByID.mockResolvedValue({id: userId});
			mockFamilyServices.deleteFamilyIfNoAccountMembers.mockResolvedValue();

			await expect(UserAccountServices.deleteUser(userId, familyId)).rejects.toThrow('Erreur lors de la suppression' +
				' de l\'utilisateur');
		});
	});

	describe('updateUserFamilyId', () => {
		const userId = 'userId';
		const familyId = 'familyId';

		beforeEach(() => {
			mockMemberQueries.updateMemberFamilyId = jest.fn();
		});

		it('should update the user family ID', async () => {
			mockMemberQueries.updateMemberFamilyId.mockResolvedValue();

			await UserAccountServices.updateUserFamilyId(userId, familyId);

			expect(mockMemberQueries.updateMemberFamilyId).toHaveBeenCalledWith(userId, familyId, null);
		});
	});
});