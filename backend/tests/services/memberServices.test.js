const MemberServices = require('../../src/services/MemberServices');

jest.mock('../../src/queries/MemberQueries');
const mockMemberQueries = require('../../src/queries/MemberQueries');

describe('Test member services', () => {
	describe('getMemberById', () => {
		it('should return member information with valid member ID', async () => {
			const mockMemberDetails = {
				id: 'memberId',
				name: 'Test User',
				color: '#ff0000'
			};
			const expectedMemberDetails = mockMemberDetails;

			mockMemberQueries.getMemberById.mockResolvedValue(mockMemberDetails);

			const memberDetails = await MemberServices.getMemberById('memberId');
			expect(memberDetails).toEqual(expectedMemberDetails);
		});

		it('should return "undefined" if member ID not found', async () => {
			mockMemberQueries.getMemberById.mockResolvedValue(undefined);
			const memberDetails = await MemberServices.getMemberById('memberId');
			expect(memberDetails).toBeUndefined();
		});
	});

	describe('getAllMembersByFamilyId', () => {
		const familyId = 'familyId';
	
		it('should return account members and guest members correctly', async () => {
			const mockAccountMembers = [
				{ id_member: 'accountMember1', name: 'Account Member 1', color: '#ff0000' },
				{ id_member: 'accountMember2', name: 'Account Member 2', color: '#00ff00' }
			];
			const mockGuestMembers = [
				{ id_member: 'guestMember1', name: 'Guest Member 1', color: '#0000ff' }
			];
	
			const expectedMembers = {
				accountMembers: [
					{ id: 'accountMember1', name: 'Account Member 1', color: '#ff0000' },
					{ id: 'accountMember2', name: 'Account Member 2', color: '#00ff00' }
				],
				guestMembers: [
					{ id: 'guestMember1', name: 'Guest Member 1', color: '#0000ff' }
				]
			};
	
			mockMemberQueries.getAccountMembersByFamilyId.mockResolvedValue(mockAccountMembers);
			mockMemberQueries.getGuestMembersByFamilyId.mockResolvedValue(mockGuestMembers);
	
			const members = await MemberServices.getAllMembersByFamilyId(familyId);
	
			expect(members).toEqual(expectedMembers);
			expect(mockMemberQueries.getAccountMembersByFamilyId).toHaveBeenCalledWith(familyId);
			expect(mockMemberQueries.getGuestMembersByFamilyId).toHaveBeenCalledWith(familyId);
		});
	
		it('should return empty accountMembers and guestMembers if no members are found', async () => {
			mockMemberQueries.getAccountMembersByFamilyId.mockResolvedValue([]);
			mockMemberQueries.getGuestMembersByFamilyId.mockResolvedValue([]);
	
			const members = await MemberServices.getAllMembersByFamilyId(familyId);
	
			expect(members).toEqual({ accountMembers: [], guestMembers: [] });
			expect(mockMemberQueries.getAccountMembersByFamilyId).toHaveBeenCalledWith(familyId);
			expect(mockMemberQueries.getGuestMembersByFamilyId).toHaveBeenCalledWith(familyId);
		});
	
		it('should return empty accountMembers if no account members are found', async () => {
			const mockGuestMembers = [
				{ id_member: 'guestMember1', name: 'Guest Member 1', color: '#0000ff' }
			];
	
			mockMemberQueries.getAccountMembersByFamilyId.mockResolvedValue([]);
			mockMemberQueries.getGuestMembersByFamilyId.mockResolvedValue(mockGuestMembers);
	
			const members = await MemberServices.getAllMembersByFamilyId(familyId);
	
			expect(members).toEqual({
				accountMembers: [],
				guestMembers: [
					{ id: 'guestMember1', name: 'Guest Member 1', color: '#0000ff' }
				]
			});
			expect(mockMemberQueries.getAccountMembersByFamilyId).toHaveBeenCalledWith(familyId);
			expect(mockMemberQueries.getGuestMembersByFamilyId).toHaveBeenCalledWith(familyId);
		});
	
		it('should return empty guestMembers if no guest members are found', async () => {
			const mockAccountMembers = [
				{ id_member: 'accountMember1', name: 'Account Member 1', color: '#ff0000' }
			];
	
			mockMemberQueries.getAccountMembersByFamilyId.mockResolvedValue(mockAccountMembers);
			mockMemberQueries.getGuestMembersByFamilyId.mockResolvedValue([]);
	
			const members = await MemberServices.getAllMembersByFamilyId(familyId);
	
			expect(members).toEqual({
				accountMembers: [
					{ id: 'accountMember1', name: 'Account Member 1', color: '#ff0000' }
				],
				guestMembers: []
			});
			expect(mockMemberQueries.getAccountMembersByFamilyId).toHaveBeenCalledWith(familyId);
			expect(mockMemberQueries.getGuestMembersByFamilyId).toHaveBeenCalledWith(familyId);
		});
	});
	
	describe('createMember', () => {
		it('should create member and return the created member', async () => {
			const memberDetails = {
				name: 'newname',
				color: 'newcolor',
			};

			const mockMemberDetails = {
				name: 'newname',
				color: 'newcolor',
			};

			const expectedMemberDetails = mockMemberDetails;

			mockMemberQueries.createMember.mockResolvedValue();
			mockMemberQueries.getMemberById.mockResolvedValue(mockMemberDetails);

			const createdMember = await MemberServices.createMember(memberDetails);
			expect(createdMember).toEqual(expectedMemberDetails);
		});
	});

	describe('getMemberImageContent', () => {
		it('should return member image content with valid member ID', async () => {
			const mockImage = {
				image_content: 'image',
				image_content_type: 'image/jpeg'
			};
			const expectedImage = {
				imageContent: 'image',
				imageContentType: 'image/jpeg'
			};

			mockMemberQueries.getMemberImageContent.mockResolvedValue(mockImage);

			const image = await MemberServices.getMemberImageContent('memberId');
			expect(image).toEqual(expectedImage);
		});

		it('should return "undefined" if member image content not found', async () => {
			mockMemberQueries.getMemberImageContent.mockResolvedValue(undefined);
			const image = await MemberServices.getMemberImageContent('memberId');
			expect(image).toBeUndefined();
		});
	});

	describe('isMemberInFamily', () => {
		it('should return true if member is in family', async () => {
			mockMemberQueries.isMemberInFamily.mockResolvedValue(true);
			const isInFamily = await MemberServices.isMemberInFamily('memberId', 'familyId');
			expect(isInFamily).toBe(true);
		});

		it('should return false if member is not in family', async () => {
			mockMemberQueries.isMemberInFamily.mockResolvedValue(false);
			const isInFamily = await MemberServices.isMemberInFamily('memberId', 'familyId');
			expect(isInFamily).toBe(false);
		});
	});

	describe('updateMemberImage', () => {
		it('should update member image and return updated image content', async () => {
			const mockImage = {
				imageContent: 'image',
				imageContentType: 'image/jpeg'
			};
			const expectedImage = mockImage;

			mockMemberQueries.updateMemberImage.mockResolvedValue(true);
			jest.spyOn(MemberServices, 'getMemberImageContent').mockResolvedValue(mockImage);

			const updatedImage = await MemberServices.updateMemberImage('memberId', 'image', 'image/jpeg');
			expect(updatedImage).toEqual(expectedImage);
		});

		it('should throw an error if image update fails', async () => {
			mockMemberQueries.updateMemberImage.mockResolvedValue(false);

			await expect(MemberServices.updateMemberImage('memberId', 'image', 'image/jpeg'))
				.rejects
				.toThrow(`Erreur lors de la mise-à-jour de l'image`);
		});
	});

	describe('updateMemberInformations', () => {
		const member = { id: 'memberId', name: 'Updated Name', color: '#ff00ff' };
	
		it('should update member information and return updated member details', async () => {
			const mockUpdatedMemberDetails = {
				id: 'memberId',
				name: 'Updated Name',
				color: '#ff00ff'
			};
	
			mockMemberQueries.updateMemberInformations.mockResolvedValue(true);
			mockMemberQueries.getMemberById.mockResolvedValue(mockUpdatedMemberDetails);
	
			const updatedMember = await MemberServices.updateMemberInformations(member);
	
			expect(updatedMember).toEqual(mockUpdatedMemberDetails);
			expect(mockMemberQueries.updateMemberInformations).toHaveBeenCalledWith(member.id, member.name, member.color);
			expect(mockMemberQueries.getMemberById).toHaveBeenCalledWith(member.id);
		});
	});

	describe('deleteMember', () => {
		const memberId = 'memberId';
	
		it('should delete member successfully', async () => {
			mockMemberQueries.deleteMember.mockResolvedValue(true);
			mockMemberQueries.getMemberById.mockResolvedValue(undefined);
	
			await MemberServices.deleteMember(memberId);
	
			expect(mockMemberQueries.deleteMember).toHaveBeenCalledWith(memberId);
	
			expect(mockMemberQueries.getMemberById).toHaveBeenCalledWith(memberId);
		});
	
		it('should throw an error if member still exists after deletion', async () => {
			mockMemberQueries.deleteMember.mockResolvedValue(true);
			mockMemberQueries.getMemberById.mockResolvedValue({ id: memberId, name: 'Test User' });
	
			await expect(MemberServices.deleteMember(memberId)).rejects.toThrow(
				'Erreur lors de la suppression de l\'utilisateur'
			);
	
			expect(mockMemberQueries.deleteMember).toHaveBeenCalledWith(memberId);
			expect(mockMemberQueries.getMemberById).toHaveBeenCalledWith(memberId);
		});
	});
	
	
});