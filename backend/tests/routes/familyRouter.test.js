const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/middlewares/auth/authMiddleware', () => jest.fn((req, res, next) => {
	req.user = {
		email: 'email',
		userId: 'mockUserId',
		familyId: 'familyId'
	};
	next();
}));

jest.mock('../../src/services/FamilyServices');
const mockFamilyServices = require('../../src/services/FamilyServices');


describe('Test family Router', () => {

    describe('GET /families/my-family', () => {
        it('should return family informations in json with code 200', async () => {
            const mockFamilyDetails = {
                name: 'name',
                color: 'color'
            };

            mockFamilyServices.getFamilyById.mockResolvedValue(mockFamilyDetails);

            const response = await request(app)
                .get('/families/my-family')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(response.body.family).toEqual(mockFamilyDetails);
        });
    });
    describe('POST /families', () => {
        it('should return family informations in json with code 201', async () => {
            const mockFamilyDetails = {
                name: 'name',
                color: 'color'
            };

            mockFamilyServices.createFamily.mockResolvedValue(mockFamilyDetails);

            const response = await request(app)
                .post('/families')
                .send({ name: 'name', color: 'color' })
                .expect('Content-Type', /json/)
                .expect(201)

            expect(response.body).toEqual(mockFamilyDetails);
        });
        it('should return 400 for invalid family name', async () => {
            const response = await request(app)
                .post('/families')
                .send({ name: 'Bob!', color: 'color' })
                .expect(400);

            expect(response.body.message).toContain('"name"');
        });
    });
    describe('GET /families/my-family/image', () => {
        it('should return family image in json with code 200', async () => {
            const mockImageContent = Buffer.from('image content');
            const mockImageContentType = 'image/jpeg';

            mockFamilyServices.getFamilyImageContent.mockResolvedValue({imageContent: mockImageContent,imageContentType: mockImageContentType});

            const response = await request(app)
                .get('/families/my-family/image')
                .expect('Content-Type', mockImageContentType)
                .expect(200)

            expect(response.body).toEqual(mockImageContent);
        });
    });
    // describe('PUT /families/my-family/image', () => {
    //     it('should update family image and return it', async () => {
    //         const mockImageContent = Buffer.from('image content');
    //         const mockImageContentType = 'image/jpeg';

    //         mockFamilyServices.updateFamilyImage.mockResolvedValue({
    //             imageContent: mockImageContent,
    //             imageContentType: mockImageContentType
    //         });

    //         const response = await request(app)
    //             .put('/families/my-family/image')
    //             .attach('family-image', mockImageContent)
    //             // .expect('Content-Type', mockImageContentType)
    //             .expect(200);

    //         expect(response.body).toEqual(mockImageContent);
    //     });
    // });
});