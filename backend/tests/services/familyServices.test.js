const FamilyServices = require('../../src/services/FamilyServices');

jest.mock('../../src/queries/FamilyQueries');
jest.mock('../../src/queries/MemberQueries');
jest.mock('../../src/services/MemberServices');

const mockFamilyQueries = require('../../src/queries/FamilyQueries');
const mockMemberQueries = require('../../src/queries/MemberQueries');
const mockMemberServices = require('../../src/services/MemberServices');

describe('Test family services', () => {
	beforeEach(() => {
        jest.clearAllMocks();
    });

	describe('createFamily', () => {
		const mockFamily = {
			name: 'New Family',
			color: '#ff5733'
		};
		const userId = 'userId';
	
		it('should create a family and return the family details', async () => {
			const newFamilyId = 'newFamilyId';
			const mockFamilyDetails = {
				name: 'New Family',
				color: '#ff5733'
			};
	
			mockFamilyQueries.createFamily.mockResolvedValue(newFamilyId);
			mockFamilyQueries.getFamilyById.mockResolvedValue(mockFamilyDetails);
	
			const family = await FamilyServices.createFamily(mockFamily, userId);
	
			expect(family).toEqual(mockFamilyDetails);
		});

		it('should throw an error if no family created', async () => {
			const newFamilyId = 'newFamilyId';
			mockFamilyQueries.createFamily.mockResolvedValue(newFamilyId);
	
			mockFamilyQueries.getFamilyById.mockResolvedValue(undefined);

			await expect(FamilyServices.createFamily(mockFamily, userId)).rejects.toThrow('Famille introuvable');
		});
	});
	
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

		it('should return "undefined" if family image content is not found', async () => {
			mockFamilyQueries.getFamilyImageContent.mockResolvedValue(undefined);
			const imageContent = await FamilyServices.getFamilyImageContent('familyId');
			expect(imageContent).toBeUndefined();
		});
	});

	describe('updateFamilyImage', () => {
		it('should update family image and return updated image content', async () => {
			const mockImage = {
				imageContent: 'image',
				imageContentType: 'image/jpeg'
			};
			const expectedImage = mockImage;

			mockFamilyQueries.updateFamilyImage.mockResolvedValue(true);
			jest.spyOn(FamilyServices, 'getFamilyImageContent').mockResolvedValue(mockImage);

			const updatedImage = await FamilyServices.updateFamilyImage('familyId', 'image', 'image/jpeg');
			expect(updatedImage).toEqual(expectedImage);
		});

		it('should throw an error if image update fails', async () => {
			mockFamilyQueries.updateFamilyImage.mockResolvedValue(false);

			await expect(FamilyServices.updateFamilyImage('familyId', 'image', 'image/jpeg'))
				.rejects
				.toThrow(`Erreur lors de la mise-à-jour de l'image`);
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

	describe('updateFamily', () => {
		it('should update family information and return the updated family', async () => {
			const mockFamilyDetails = {
				name: 'newFamilyName',
				color: 'newcolor'
			};

			const expectedFamilyDetails = mockFamilyDetails;

			mockFamilyQueries.updateFamilyInformations.mockResolvedValue();
			mockFamilyQueries.getFamilyById.mockResolvedValue(mockFamilyDetails);

			const updatedFamily = await FamilyServices.updateFamilyInformations(mockFamilyDetails);
			expect(updatedFamily).toEqual(expectedFamilyDetails);
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

	describe('quitFamily', () => {
		const userId = 'userId';
		const familyId = 'familyId';

		beforeEach(() => {
			mockMemberQueries.updateMemberFamilyId = jest.fn();
			FamilyServices.deleteFamilyIfNoAccountMembers = jest.fn();
		});
		
		it('should allow a user to quit the family successfully', async () => {
			
			mockMemberServices.isMemberInFamily.mockResolvedValue(false);
			await expect(FamilyServices.quitFamily(userId, familyId)).resolves.not.toThrow();
		});
	
		it('should throw an error if the user is still a member of the family after quitting', async () => {
			mockMemberQueries.updateMemberFamilyId.mockResolvedValue(true);
	
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
	
			await expect(FamilyServices.quitFamily(userId, familyId)).rejects.toThrow('Erreur lors de la suppression de la famille de l\'utilisateur');
	
			expect(mockMemberQueries.updateMemberFamilyId).toHaveBeenCalledWith(userId, null, null);
	
			expect(mockMemberServices.isMemberInFamily).toHaveBeenCalledWith(userId, familyId);
	
			expect(FamilyServices.deleteFamilyIfNoAccountMembers).not.toHaveBeenCalled();
		});
	});

	describe('deleteFamily', () => {
		const familyId = 'familyId';
	
		it('should successfully delete a family and its members', async () => {
			mockFamilyQueries.deleteFamilyAndGuestMembers.mockResolvedValue(true);
			mockFamilyQueries.getFamilyById.mockResolvedValue(undefined);
	
			await FamilyServices.deleteFamily(familyId);
	
			expect(mockFamilyQueries.deleteFamilyAndGuestMembers).toHaveBeenCalledWith(familyId);
			expect(mockFamilyQueries.getFamilyById).toHaveBeenCalledWith(familyId);

			await expect(FamilyServices.deleteFamily(familyId)).resolves.not.toThrow();
		});
	
		it('should throw an error if the family could not be deleted', async () => {
			mockFamilyQueries.deleteFamilyAndGuestMembers.mockResolvedValue(true);
			mockFamilyQueries.getFamilyById.mockResolvedValue({ name: 'Family Name', color: '#ff0000' });
	
			await expect(FamilyServices.deleteFamily(familyId)).rejects.toThrow('Erreur lors de la suppression de la famille');
	
			expect(mockFamilyQueries.deleteFamilyAndGuestMembers).toHaveBeenCalledWith(familyId);
		});
	});
});