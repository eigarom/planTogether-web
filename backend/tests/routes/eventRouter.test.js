const request = require("supertest");
const app = require("../../src/app");

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
jest.mock("../../src/services/EventServices");
const mockEventServices = require("../../src/services/EventServices");

describe("Event Routes", () => {
    describe("GET /families/my-family/events", () => {
        it("should return events in json with code 200", async () => {
            const mockEventsDetails =
                [
                    {
                        "id": 1,
                        "name": "Concert",
                        "description": "Aller au concert du soir.",
                        "color": "#FFD700",
                        "isVisible": true,
                        "periods": [
                            {
                                "id": 1,
                                "startDateTime": "2024-10-23T20:00:00.000Z",
                                "endDateTime": "2024-10-23T22:00:00.000Z",
                                "alerts": []
                            }
                        ],                        
                        "members": [
                            {
                                "id": 1,
                                "name": "Dixie"
                            },
                            {
                                "id": 2,
                                "name": "Diddy"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Bibliothèque",
                        "description": "Rapporter mes deux livres.",
                        "color": "#00FF00",
                        "isVisible": false,
                        "periods": [
                            {
                                "id": 2,
                                "startDateTime": "2024-10-23T18:00:00.000Z",
                                "endDateTime": "2024-10-23T18:15:00.000Z",
                                "alerts": []
                            }
                        ],
                        "members": [
                            {
                                "id": 2,
                                "name": "Diddy"
                            }
                        ]
                    }
                ];

            mockEventServices.getEventsByIdFamily.mockResolvedValue(
                mockEventsDetails
            );

            const response = await request(app)
                .get("/families/my-family/events")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toEqual(mockEventsDetails);
        });

        it("should return null if events not found", async () => {
            mockEventServices.getEventsByIdFamily.mockResolvedValue(null);

            const response = await request(app)
                .get("/families/my-family/events")
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.message).toEqual("Événements pour la famille familyId introuvables");
        });

        it("should return 500 if service fails", async () => {
            mockEventServices.getEventsByIdFamily.mockRejectedValue(new Error());

            await request(app).get("/families/my-family/events").expect(500);
        });
    })

    describe("GET /families/my-family/events/:id", () => {
        it("should return event in json with code 200", async () => {
            const mockEventDetails =
            {
                "id": 3,
                "name": "Concert",
                "description": "Aller au concert du soir.",
                "color": "#F7EF05",
                "isVisible": true,
                "periods": [
                    {
                        "id": 3,
                        "startDateTime": "2024-10-27T20:00:00.000Z",
                        "endDateTime": "2024-10-27T22:00:00.000Z",
                        "alerts": []
                    },
                    {
                        "id": 5,
                        "startDateTime": "2024-10-28T20:00:00.000Z",
                        "endDateTime": "2024-10-28T22:00:00.000Z",
                        "alerts": []
                    }
                ],
                "members": [
                    {
                        "id": 3,
                        "name": "Dixie"
                    },
                    {
                        "id": 4,
                        "name": "Diddy"
                    }
                ]
            }

            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(
                mockEventDetails
            );

            const response = await request(app)
                .get("/families/my-family/events/3")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toEqual(mockEventDetails);
        });

        it('should return 403 if event is not in family', async () => {
			mockEventServices.isEventInFamily.mockResolvedValue(false);

			const response = await request(app)
				.get("/families/my-family/events/3")
				.expect(403);

			expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
		});

        it("should return 404 if event not found", async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(null);

            const response = await request(app)
                .get("/families/my-family/events/3")
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.message).toEqual("Événement 3 introuvable");
        });

        it("should return 500 if service fails", async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockRejectedValue(new Error());

            await request(app).get("/families/my-family/events/3").expect(500);
        });
    })
})