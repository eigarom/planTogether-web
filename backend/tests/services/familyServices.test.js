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
});