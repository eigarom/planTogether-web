const FamilyServices = require('../../src/services/FamilyServices');

jest.mock('../../src/queries/FamilyQueries');
const mockFamilyQueries = require('../../src/queries/FamilyQueries');

describe('Test family services', () => {
	describe('getFamilyById', () => {
		it('should return family information with valid family id', async () => {
			const mockFamilyDetails = {
				name: 'User Family',
				color: '#ff0000'
			};

			mockFamilyQueries.getFamilyById.mockResolvedValue(mockFamilyDetails);

			const familyDetails = await FamilyServices.getFamilyById('familyId');
			expect(familyDetails).toEqual(mockFamilyDetails);
		});

		it('should return "undefined" if family id not found', async () => {
			mockFamilyQueries.getFamilyById.mockResolvedValue(undefined);
			const familyDetails = await FamilyServices.getFamilyById('familyId');
			expect(familyDetails).toBeUndefined();
		});
	});

	describe('getFamilyImageContent', () => {
		it('should return family image content with valid family id', async () => {
			const mockImageContent = {
				image_content: 'image',
				image_content_type: 'image/jpeg'
			};
			const expectedImageContent = {
				imageContent: 'image',
				imageContentType: 'image/jpeg'
			};

			mockFamilyQueries.getFamilyImageContent.mockResolvedValue(mockImageContent);

			const imageContent = await FamilyServices.getFamilyImageContent('familyId');
			expect(imageContent).toEqual(expectedImageContent);
		});

		it('should return "undefined" if family image content not found', async () => {
			mockFamilyQueries.getFamilyImageContent.mockResolvedValue(undefined);
			const imageContent = await FamilyServices.getFamilyImageContent('familyId');
			expect(imageContent).toBeUndefined();
		});
	});

	describe('createInvitationCode', () => {
		it('should create a unique invitation code', async () => {
			const familyId = 'familyId';

			mockFamilyQueries.doesCodeExist.mockResolvedValue(false);
			mockFamilyQueries.updateInvitationCode.mockResolvedValue(true);

			const code = await FamilyServices.createInvitationCode(familyId);
			expect(code).toBeDefined();
			expect(code).toHaveLength(32);
		});

		it('should throw an error if the code cannot be updated', async () => {
			const familyId = 'familyId';

			mockFamilyQueries.doesCodeExist.mockResolvedValue(false);
			mockFamilyQueries.updateInvitationCode.mockResolvedValue(false);

			await expect(FamilyServices.createInvitationCode(familyId)).rejects.toThrow('Échec lors de la création du code d\'invitation');
		});
	});

	describe('getFamilyIdByInviteCode', () => {
		it('should return family id for a valid invite code', async () => {
			const inviteCode = 'validInviteCode';
			const mockFamilyId = 'familyId';
			mockFamilyQueries.getFamilyByInviteCode.mockResolvedValue({id_family: mockFamilyId});

			const familyId = await FamilyServices.getFamilyIdByInviteCode(inviteCode);
			expect(familyId).toBe(mockFamilyId);
		});

		it('should return undefined for an invalid invite code', async () => {
			const inviteCode = 'invalidInviteCode';
			mockFamilyQueries.getFamilyByInviteCode.mockResolvedValue(undefined);

			const familyId = await FamilyServices.getFamilyIdByInviteCode(inviteCode);
			expect(familyId).toBeUndefined();
		});
	});

	describe('deleteFamilyIfNoAccountMembers', () => {
		const familyId = 1;

		it('should not delete the family if there are account members', async () => {
			mockFamilyQueries.getFamilyAccountMembersCount.mockResolvedValue('1');

			await FamilyServices.deleteFamilyIfNoAccountMembers(familyId);

			expect(mockFamilyQueries.deleteFamilyAndGuestMembers).not.toHaveBeenCalled();
		});

		it('should delete the family if there are no account members', async () => {
			mockFamilyQueries.getFamilyAccountMembersCount.mockResolvedValue('0');

			await FamilyServices.deleteFamilyIfNoAccountMembers(familyId);

			expect(mockFamilyQueries.deleteFamilyAndGuestMembers).toHaveBeenCalledWith(familyId);
		});
	});
});