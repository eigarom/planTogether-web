const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/middlewares/auth/authMiddleware', () => jest.fn((req, res, next) => {
	req.user = {
		email: 'email',
		userId: 'userId',
		familyId: 'familyId'
	};
	next();
}));

jest.mock('../../src/services/MemberServices');
const mockMemberServices = require('../../src/services/MemberServices');

describe('GET /members', () => {
	describe('GET /members', () => {
		it('should return all family members if found', async () => {
			const mockFamilyMembers = [
				{ id: '1', name: 'John Doe', color: '#FF0000' },
				{ id: '2', name: 'Jane Smith', color: '#00FF00' }
			];

			mockMemberServices.getAllMembersByFamilyId.mockResolvedValue(mockFamilyMembers);
	
			const response = await request(app)
				.get('/families/my-family/members')
				.expect('Content-Type', /json/)
				.expect(200);
	
			expect(response.body).toEqual(mockFamilyMembers);
		});
	
		it('should return 404 if no family members are found', async () => {
			mockMemberServices.getAllMembersByFamilyId.mockResolvedValue(undefined);
	
			const response = await request(app)
				.get('/families/my-family/members')
				.expect('Content-Type', /json/)
				.expect(404);
	
			expect(response.body.message).toEqual('Membres de la famille introuvables');
		});
	
		it('should return 500 if service fails', async () => {
			mockMemberServices.getAllMembersByFamilyId.mockRejectedValue(new Error());
	
			await request(app)
				.get('/families/my-family/members')
				.expect('Content-Type', /json/)
				.expect(500);
		});
	});
});	

describe('GET /members/:id', () => {
    it('should return a specific member details if found', async () => {
        const mockMember = {
            id: '1',
            name: 'John Doe',
            color: '#FF0000'
        };

        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.getMemberById.mockResolvedValue(mockMember);

        const response = await request(app)
            .get('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockMember);
    });

    it('should return 403 if member is not in family', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(false);

        const response = await request(app)
            .get('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
    });

    it('should return 404 if member is not found', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.getMemberById.mockResolvedValue(null);

        const response = await request(app)
            .get('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.message).toEqual('Membre introuvable');
    });

    it('should return 500 if service fails', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.getMemberById.mockRejectedValue(new Error());

        await request(app)
            .get('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(500);
    });
});

describe('PUT /members/:id', () => {
    it('should update the member details and return the updated member', async () => {
        const mockUpdatedMember = {
            id: '1',
            name: 'John Doe Updated',
            color: '#00FF00'
        };

        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.updateMemberInformations.mockResolvedValue(mockUpdatedMember);

        const response = await request(app)
            .put('/families/my-family/members/1')
            .send({ name: 'John Doe Updated', color: '#00FF00' })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockUpdatedMember);
    });

    it('should return 400 if validation fails', async () => {
		mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        const response = await request(app)
            .put('/families/my-family/members/1')
			.send({name: '', color: '#00FF00'})
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.message).toBeDefined();
    });

    it('should return 403 if member is not in family', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(false);

        const response = await request(app)
            .put('/families/my-family/members/1')
            .send({ name: 'John Doe Updated', color: '#00FF00' })
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
    });

    it('should return 500 if service fails', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.updateMemberInformations.mockRejectedValue(new Error());

        await request(app)
            .put('/families/my-family/members/1')
            .send({ name: 'John Doe Updated', color: '#00FF00' })
            .expect('Content-Type', /json/)
            .expect(500);
    });
});

describe('DELETE /members/:id', () => {
    it('should delete the member and return an empty object', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.deleteMember.mockResolvedValue();

        const response = await request(app)
            .delete('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({});
    });

    it('should return 403 if member is not in family', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(false);

        const response = await request(app)
            .delete('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
    });

    it('should return 500 if service fails', async () => {
        mockMemberServices.isMemberInFamily.mockResolvedValue(true);
        mockMemberServices.deleteMember.mockRejectedValue(new Error());

        await request(app)
            .delete('/families/my-family/members/1')
            .expect('Content-Type', /json/)
            .expect(500);
    });
});

describe('POST /members', () => {
	it('should create a new member and return the member details', async () => {
		const mockMemberDetails = {
			name: 'John Doe',
			color: '#FF0000'
		};

		mockMemberServices.isMemberInFamily.mockResolvedValue(true);
		mockMemberServices.createMember.mockResolvedValue(mockMemberDetails);

		const response = await request(app)
			.post('/families/my-family/members')
			.send({ name: 'John Doe', color: '#FF0000' })
			.expect('Content-Type', /json/)
			.expect(201);

		expect(response.body).toEqual(mockMemberDetails);
	});

	it('should return 400 if validation fails', async () => {
		const response = await request(app)
			.post('/families/my-family/members')
			.send({ name: '', color: '#FF0000' }) // Invalid name
			.expect(400);

		expect(response.body.message).toBeDefined();
	});

	it('should return 404 if user or family not found', async () => {
		mockMemberServices.isMemberInFamily.mockResolvedValue(false);

		const response = await request(app)
			.post('/families/my-family/members')
			.send({ name: 'John Doe', color: '#FF0000' })
			.expect(404);

		expect(response.body.message).toEqual('Utilisateur ou famille introuvable');
	});

	it('should return 500 if service fails', async () => {
		mockMemberServices.isMemberInFamily.mockResolvedValue(true);
		mockMemberServices.createMember.mockRejectedValue(new Error());

		await request(app)
			.post('/families/my-family/members')
			.send({ name: 'John Doe', color: '#FF0000' })
			.expect(500);
	});
});

describe('Member Image Routes', () => {
	describe('GET /members/:id/image', () => {
		it('should return the member image if found', async () => {
			const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");
			const mockImageInfo = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: 'image/jpeg'
			};

			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.getMemberImageContent.mockResolvedValue(mockImageInfo);

			const response = await request(app)
				.get('/families/my-family/members/1/image')
				.expect('Content-Type', /image\/jpeg/)
				.expect(200);

			expect(response.body).toEqual(mockImageInfo.imageContent);
		});

		it('should return 403 if member is not in family', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(false);

			const response = await request(app)
				.get('/families/my-family/members/1/image')
				.expect(403);

			expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
		});

		it('should return 404 if image not found', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.getMemberImageContent.mockResolvedValue(null);

			const response = await request(app)
				.get('/families/my-family/members/1/image')
				.expect(404);

			expect(response.body.message).toEqual('Image du membre introuvable');
		});
	});

	describe('PUT /members/:id/image', () => {
		const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

		it('should update the member image and return the updated image', async () => {
			const mockImageInfo = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: 'image/jpeg'
			};

			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockResolvedValue(mockImageInfo);

			const response = await request(app)
				.put('/families/my-family/members/1/image')
				.attach('member-image', onePixelTransparentPngImage, 'image.jpeg')
				.expect('Content-Type', /image\/jpeg/)
				.expect(200);

			expect(response.body).toEqual(mockImageInfo.imageContent);
		});

		it('should return 403 if member is not in family', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(false);

			const response = await request(app)
				.put('/families/my-family/members/1/image')
				.attach('member-image', onePixelTransparentPngImage, 'image.jpeg')
				.expect(403);

			expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
		});

		it('should return 400 if validation fails', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);

			const response = await request(app)
				.put('/families/my-family/members/1/image')
				.attach('member-image', onePixelTransparentPngImage, 'invalid.txt')
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if new image not found', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockResolvedValue(null);

			const response = await request(app)
				.put('/families/my-family/members/1/image')
				.attach('member-image', onePixelTransparentPngImage, 'image.jpeg')
				.expect(500);

			expect(response.body.message).toEqual('Erreur lors de la modification de l\'image');
		});

		it('should return 500 if service fails', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockRejectedValue(new Error());

			await request(app)
				.put('/families/my-family/members/1/image')
				.attach('member-image', Buffer.from('new image data'), 'image.png')
				.expect(500);
		});
	});

	describe('DELETE /members/:id/image', () => {
		it('should delete the member image and return an empty object', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockResolvedValue({imageContent: null, imageContentType: null});

			const response = await request(app)
				.delete('/families/my-family/members/1/image')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return 403 if member is not in family', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(false);

			const response = await request(app)
				.delete('/families/my-family/members/1/image')
				.expect(403);

			expect(response.body.message).toEqual('Accès non autorisé aux données de ce membre');
		});

		it('should return 500 if image exists', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockResolvedValue({imageContent: 'image', imageContentType: 'type'});

			const response = await request(app)
				.delete('/families/my-family/members/1/image')
				.expect(500);

			expect(response.body.message).toEqual('Erreur lors de la suppression de l\'image');
		});

		it('should return 500 if service fails', async () => {
			mockMemberServices.isMemberInFamily.mockResolvedValue(true);
			mockMemberServices.updateMemberImage.mockRejectedValue(new Error());

			await request(app)
				.delete('/families/my-family/members/1/image')
				.expect(500);
		});
	});
});

