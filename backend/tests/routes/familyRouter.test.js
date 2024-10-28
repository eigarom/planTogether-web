const request = require('supertest');
const app = require('../../src/app');
//const authUtils = require('../../src/utils/authUtils');

jest.mock('../../src/middlewares/auth/authMiddleware', () => jest.fn((req, res, next) => {
	req.user = {
		email: 'email',
		userId: 'userId',
		familyId: 'familyId'
	};
	next();
}));
jest.mock('../../src/utils/authUtils');
jest.mock('../../src/services/FamilyServices');
jest.mock('../../src/utils/authUtils');
const mockFamilyServices = require('../../src/services/FamilyServices');


describe('Family Routes', () => {

	describe('GET /families/my-family', () => {
		it('should return family information in json with code 200', async () => {
			const mockFamilyDetails = {
				name: 'familyName',
				color: 'color',
			};

			mockFamilyServices.getFamilyById.mockResolvedValue(mockFamilyDetails);

			const response = await request(app)
				.get('/families/my-family')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(mockFamilyDetails);
		});

		it('should return null if family not found', async () => {
			mockFamilyServices.getFamilyById.mockResolvedValue(null);

			const response = await request(app)
				.get('/families/my-family')
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body.message).toEqual('Famille introuvable');
		});

		it('should return 500 if service fails', async () => {
			mockFamilyServices.getFamilyById.mockRejectedValue(new Error());

			await request(app)
				.get('/families/my-family')
				.expect(500);
		});
	});

	describe('GET /families/my-family/image', () => {
		it('should return family image with code 200', async () => {
			const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");
			const mockFamilyImageDetails = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: 'image/jpeg'
			};

			mockFamilyServices.getFamilyImageContent.mockResolvedValue(mockFamilyImageDetails);

			const response = await request(app)
				.get('/families/my-family/image')
				.expect('Content-Type', 'image/jpeg')
				.expect(200)

			expect(response.body).toEqual(mockFamilyImageDetails.imageContent);
		});

		it('throws return code 404 if user image not found', async () => {
			mockFamilyServices.getFamilyImageContent.mockResolvedValue(undefined);

			const response = await request(app)
				.get('/families/my-family/image')
				.expect(404)

			expect(response.body.message).toEqual(`Image de la famille introuvable`);
		});

		it('should return 500 if service fails', async () => {
			mockFamilyServices.getFamilyImageContent.mockRejectedValue(new Error());

			await request(app)
				.get('/families/my-family/image')
				.expect(500);
		});
	});

    describe('POST /families', () => {
        it('should return 400 for invalid family name', async () => {
            const response = await request(app)
                .post('/families')
                .send({ name: 'Bob!', color: 'color' })
                .expect(400);

            expect(response.body.message).toContain('"name"');
        });
    });
});