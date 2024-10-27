const MemberServices = require('../../src/services/MemberServices');

jest.mock('../../src/queries/MemberQueries');
const mockMemberQueries = require('../../src/queries/MemberQueries');

describe('Test member services', () => {
	describe('getMemberById', () => {
		it('should return member information with valid member ID', async () => {
			const mockMemberDetails = {
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
});