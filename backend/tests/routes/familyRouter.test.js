const request = require("supertest");
const app = require("../../src/app");
const authUtils = require("../../src/utils/authUtils");

jest.mock("../../src/middlewares/auth/authMiddleware", () =>
	jest.fn((req, res, next) => {
		req.user = {
			email: "email",
			userId: "userId",
			familyId: "familyId",
		};
		next();
	})
);
jest.mock("../../src/utils/authUtils");
jest.mock("../../src/services/FamilyServices");
jest.mock("../../src/services/UserAccountServices");
jest.mock("../../src/utils/authUtils");
const mockFamilyServices = require("../../src/services/FamilyServices");
const mockUserAccountServices = require("../../src/services/UserAccountServices");

describe("Family Routes", () => {
	describe("GET /families/my-family", () => {
		it("should return family information in json with code 200", async () => {
			const mockFamilyDetails = {
				name: "familyName",
				color: "color",
			};

			mockFamilyServices.getFamilyById.mockResolvedValue(
				mockFamilyDetails
			);

			const response = await request(app)
				.get("/families/my-family")
				.expect("Content-Type", /json/)
				.expect(200);

			expect(response.body).toEqual(mockFamilyDetails);
		});

		it("should return null if family not found", async () => {
			mockFamilyServices.getFamilyById.mockResolvedValue(null);

			const response = await request(app)
				.get("/families/my-family")
				.expect("Content-Type", /json/)
				.expect(404);

			expect(response.body.message).toEqual("Famille introuvable");
		});

		it("should return 500 if service fails", async () => {
			mockFamilyServices.getFamilyById.mockRejectedValue(new Error());

			await request(app).get("/families/my-family").expect(500);
		});
	});

	describe("GET /families/my-family/image", () => {
		it("should return family image with code 200", async () => {
			const onePixelTransparentPngImage = Buffer.from(
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=",
				"base64"
			);
			const mockFamilyImageDetails = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: "image/jpeg",
			};

			mockFamilyServices.getFamilyImageContent.mockResolvedValue(
				mockFamilyImageDetails
			);

			const response = await request(app)
				.get("/families/my-family/image")
				.expect("Content-Type", "image/jpeg")
				.expect(200);

			expect(response.body).toEqual(mockFamilyImageDetails.imageContent);
		});

		it("throws return code 404 if user image not found", async () => {
			mockFamilyServices.getFamilyImageContent.mockResolvedValue(
				undefined
			);

			const response = await request(app)
				.get("/families/my-family/image")
				.expect(404);

			expect(response.body.message).toEqual(
				`Image de la famille introuvable`
			);
		});

		it("should return 500 if service fails", async () => {
			mockFamilyServices.getFamilyImageContent.mockRejectedValue(
				new Error()
			);

			await request(app).get("/families/my-family/image").expect(500);
		});
	});

	describe("POST /families", () => {
		it("should return 400 for invalid family name", async () => {
			const response = await request(app)
				.post("/families")
				.send({name: "Bob!", color: "color"})
				.expect(400);

			expect(response.body.message).toContain('"name"');
		});
		it("should return family informations in json with code 201", async () => {
			const mockFamilyDetails = {
				name: "name",
				color: "#FF0000",
			};

			const mockToken = "mockToken";

			mockFamilyServices.createFamily.mockResolvedValue(
				mockFamilyDetails
			);
			mockUserAccountServices.getUserCredentialsByEmail.mockResolvedValue(
				"user"
			);
			authUtils.generateToken.mockReturnValue(mockToken);

			const response = await request(app)
				.post("/families")
				.send({name: "name", color: "#FF0000"})
				.expect("Content-Type", /json/)
				.expect(201);

			expect(response.body.family).toEqual(mockFamilyDetails);
			expect(response.body.token).toEqual(mockToken);
		});

		it("should return 500 if service fails", async () => {
			mockFamilyServices.createFamily.mockRejectedValue(new Error());

			await request(app)
				.post("/families")
				.send({name: "name", color: "#FF0000"})
				.expect("Content-Type", /json/)
				.expect(500);
		});
	});

	describe("PUT /families/invite", () => {
		it("should create an invitation code and return it with status 201", async () => {
			const mockInviteCode = "INVITE123";
			mockFamilyServices.createInvitationCode.mockResolvedValue(mockInviteCode);

			const response = await request(app)
				.put("/families/my-family/invite")
				.expect("Content-Type", /json/)
				.expect(200);

			expect(response.body.inviteCode).toEqual(mockInviteCode);
		});

		it("should return 500 if service fails", async () => {
			mockFamilyServices.createInvitationCode.mockRejectedValue(new Error());

			await request(app).put("/families/my-family/invite").expect(500);
		});
	});

	describe("PUT /families/join", () => {
		it("should update user family ID and return a new token with status 200", async () => {
			const mockInviteCode = "INVITE123";
			const mockFamilyId = "familyId123";
			const mockToken = "mockToken";
			const mockUpdatedUser = {
				email: "email",
				userId: "userId",
				familyId: mockFamilyId
			};

			mockFamilyServices.getFamilyIdByInviteCode.mockResolvedValue(mockFamilyId);
			mockUserAccountServices.updateUserFamilyId.mockResolvedValue();
			mockUserAccountServices.getUserCredentialsByEmail.mockResolvedValue(mockUpdatedUser);
			authUtils.generateToken.mockReturnValue(mockToken);

			const response = await request(app)
				.put("/families/join")
				.send({inviteCode: mockInviteCode})
				.expect("Content-Type", /json/)
				.expect(200);

			expect(response.body.token).toEqual(mockToken);
		});

		it("should return 400 for invalid or expired invite code", async () => {
			mockFamilyServices.getFamilyIdByInviteCode.mockResolvedValue(null);

			const response = await request(app)
				.put("/families/join")
				.send({inviteCode: "INVALIDCODE"})
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body.message).toEqual("Code d'invitation invalide ou expiré");
		});

		it("should return 400 for invalid request body", async () => {
			const response = await request(app)
				.put("/families/join")
				.send({inviteCode: ""})
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body.message).toContain("Le code d'invitation ne peut pas être vide");
		});

		it("should return 500 if service fails", async () => {
			mockFamilyServices.getFamilyIdByInviteCode.mockRejectedValue(new Error());

			await request(app).put("/families/join").send({inviteCode: "INVITE123"}).expect(500);
		});
	});
});
