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
                                "name": "Dixie",
                                "color": "#E677C6"
                            },
                            {
                                "id": 2,
                                "name": "Diddy",
                                "color": "#E60514"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "Bibliothèque",
                        "description": "Rapporter mes deux livres.",
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
                                "name": "Diddy",
                                "color": "#E60514"
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

    describe("GET /families/my-family/events/:id/periods/:periodId", () => {
        it("should return event in json with code 200", async () => {
            const mockEventDetails =
            {
                "id": 2,
                "name": "Garage",
                "description": "Changement de pneus",
                "isVisible": true,
                "period": {
                    "id": 2,
                    "startDateTime": "2024-11-05T13:30:00.000Z",
                    "endDateTime": "2024-11-05T15:00:00.000Z",
                    "alerts": [
                        {
                            "id": 1,
                            "dateTime": "2024-11-05T12:30:00.000Z"
                        }
                    ]
                },
                "members": [
                    {
                        "id": 2,
                        "name": "Diddy",
                        "color": "#E60514"
                    }
                ]
            }

            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventWithPeriodId.mockResolvedValue(mockEventDetails);

            const response = await request(app)
                .get("/families/my-family/events/2/periods/2")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toEqual(mockEventDetails);
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .get("/families/my-family/events/2/periods/2")
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it("should return 500 if service fails", async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventWithPeriodId.mockRejectedValue(new Error());

            await request(app).get("/families/my-family/events/2/periods/2").expect(500);
        });
    })

    describe("GET /families/my-family/events/:id/periods", () => {
        it("should return numberOfPeriods in json with code 200", async () => {
            const mockNumberOfPeriods =
            {
                "numberOfPeriods": 2
            }

            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getNumberOfPeriodsByEventId.mockResolvedValue(mockNumberOfPeriods);

            const response = await request(app)
                .get("/families/my-family/events/7/periods")
                .expect("Content-Type", /json/)
                .expect(200);

            expect(response.body).toEqual(mockNumberOfPeriods);
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .get("/families/my-family/events/7/periods")
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it("should return 404 if event not found", async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getNumberOfPeriodsByEventId.mockResolvedValue(null);

            const response = await request(app)
                .get("/families/my-family/events/7/periods")
                .expect("Content-Type", /json/)
                .expect(404);

            expect(response.body.message).toEqual("L'événement 7 ne contient pas de périodes");
        });

        it("should return 500 if service fails", async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getNumberOfPeriodsByEventId.mockRejectedValue(new Error());

            await request(app).get("/families/my-family/events/7/periods").expect(500);
        });
    })

    describe('POST /families/my-family/events', () => {
        it('should create a new event and return the event details', async () => {
            const mockEventDetails = {
                "id": 10,
                "name": "Yoga",
                "description": "Séances de yoga entre filles",
                "isVisible": true,
                "periods": [
                    {
                        "id": 17,
                        "startDateTime": "2024-11-12T22:00:00.000Z",
                        "endDateTime": "2024-11-12T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 13,
                                "dateTime": "2024-11-12T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 18,
                        "startDateTime": "2024-11-19T22:00:00.000Z",
                        "endDateTime": "2024-11-19T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 14,
                                "dateTime": "2024-11-19T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 19,
                        "startDateTime": "2024-11-26T22:00:00.000Z",
                        "endDateTime": "2024-11-26T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 15,
                                "dateTime": "2024-11-26T21:30:00.000Z"
                            }
                        ]
                    }
                ],
                "members": [
                    {
                        "id": 1,
                        "name": "Dixie",
                        "color": "#E677C6"
                    },
                    {
                        "id": 3,
                        "name": "Candy",
                        "color": "#eab4f0"
                    }
                ]
            };

            mockEventServices.createEvent.mockResolvedValue(mockEventDetails);

            const response = await request(app)
                .post('/families/my-family/events')
                .send({
                    "name": "Yoga",
                    "description": "Séances de yoga entre filles",
                    "isVisible": true,
                    "periods": [
                        {
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                "2024-11-12T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                "2024-11-19T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                "2024-11-26T21:30:00.000Z"
                            ]
                        }
                    ],
                    "members": [
                        1, 3
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toEqual(mockEventDetails);
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(app)
                .post('/families/my-family/events')
                .send({
                    "name": '', // Invalid name
                    "description": "Séances de yoga entre filles",
                    "isVisible": true,
                    "periods": [
                        {
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                "2024-11-12T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                "2024-11-19T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                "2024-11-26T21:30:00.000Z"
                            ]
                        }
                    ],
                    "members": [
                        1, 3
                    ]
                })
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 500 if service fails', async () => {
            mockEventServices.createEvent.mockRejectedValue(new Error());

            await request(app)
                .post('/families/my-family/events')
                .send({
                    "name": 'Yoga',
                    "description": "Séances de yoga entre filles",
                    "isVisible": true,
                    "periods": [
                        {
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                "2024-11-12T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                "2024-11-19T21:30:00.000Z"
                            ]
                        },
                        {
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                "2024-11-26T21:30:00.000Z"
                            ]
                        }
                    ],
                    "members": [
                        1, 3
                    ]
                })
                .expect(500);
        });
    });

    describe('PUT /families/my-family/events/:id', () => {
        it('should update an event and return the updated event details', async () => {
            const mockUpdatedEvent = {
                "id": 10,
                "name": "Yoga",
                "description": "Séances de yoga tous ensemble",
                "isVisible": true,
                "periods": [
                    {
                        "id": 17,
                        "startDateTime": "2024-11-12T22:00:00.000Z",
                        "endDateTime": "2024-11-12T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 13,
                                "dateTime": "2024-11-12T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 18,
                        "startDateTime": "2024-11-19T22:00:00.000Z",
                        "endDateTime": "2024-11-19T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 14,
                                "dateTime": "2024-11-19T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 19,
                        "startDateTime": "2024-11-26T22:00:00.000Z",
                        "endDateTime": "2024-11-26T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 15,
                                "dateTime": "2024-11-26T21:30:00.000Z"
                            }
                        ]
                    }
                ],
                "members": [
                    {
                        "id": 1,
                        "name": "Dixie",
                        "color": "#E677C6"
                    },
                    {
                        "id": 2,
                        "name": "Diddy",
                        "color": "#E60514"
                    },
                    {
                        "id": 3,
                        "name": "Candy",
                        "color": "#eab4f0"
                    }
                ]
            };

            mockEventServices.getEventById.mockResolvedValue({
                "id": 10,
                "name": "Yoga",
                "description": "",
                "isVisible": true,
                "periods": [
                    {
                        "id": 17,
                        "startDateTime": "2024-11-12T22:00:00.000Z",
                        "endDateTime": "2024-11-12T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 13,
                                "dateTime": "2024-11-12T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 18,
                        "startDateTime": "2024-11-19T22:00:00.000Z",
                        "endDateTime": "2024-11-19T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 14,
                                "dateTime": "2024-11-19T21:30:00.000Z"
                            }
                        ]
                    },
                    {
                        "id": 19,
                        "startDateTime": "2024-11-26T22:00:00.000Z",
                        "endDateTime": "2024-11-26T23:00:00.000Z",
                        "alerts": [
                            {
                                "id": 15,
                                "dateTime": "2024-11-26T21:30:00.000Z"
                            }
                        ]
                    }
                ],
                "members": [
                    {
                        "id": 1,
                        "name": "Dixie",
                        "color": "#E677C6"
                    },
                    {
                        "id": 3,
                        "name": "Candy",
                        "color": "#eab4f0"
                    }
                ]
            });
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.updateEvent.mockResolvedValue(mockUpdatedEvent);

            const response = await request(app)
                .put('/families/my-family/events/10')
                .send({
                    "name": "Yoga",
                    "description": "Séances de yoga tous ensemble",
                    "isVisible": true,
                    "members": [
                        1, 3, 2
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(mockUpdatedEvent);
        });

        it('should return 400 if validation fails', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);

            const response = await request(app)
                .put('/families/my-family/events/10')
                .send({
                    "name": '', // Invalid name
                    "description": "Séances de yoga entre filles",
                    "isVisible": true,
                    "members": [
                        1, 3
                    ]
                })
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .put('/families/my-family/events/10')
                .send({
                    "name": 'Yoga', // Invalid name
                    "description": "Séances de yoga entre filles",
                    "isVisible": true,
                    "members": [
                        1, 3
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it('should return 500 if service fails', async () => {
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 10,
                    "name": "Yoga",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "id": 17,
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 13,
                                    "dateTime": "2024-11-12T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 18,
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 14,
                                    "dateTime": "2024-11-19T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 19,
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 15,
                                    "dateTime": "2024-11-26T21:30:00.000Z"
                                }
                            ]
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });

            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.updateEvent.mockRejectedValue(new Error());

            await request(app)
                .put('/families/my-family/events/10')
                .send({
                    "name": "Yoga",
                    "description": "Séances de yoga tous ensemble",
                    "isVisible": true,
                    "members": [
                        1, 3, 2
                    ]
                })
                .expect(500);
        });
    });

    describe('PUT /families/my-family/events/:id/periods/:periodId', () => {
        it('should update a period and return the updated period details', async () => {
            const mockUpdatedPeriod = {
                "periodId": 22,
                "startDateTime": "2024-11-25T22:00:00.000Z",
                "endDateTime": "2024-11-25T23:00:00.000Z",
                "alerts": [
                    {
                        "id": 19,
                        "dateTime": "2024-11-25T21:30:00.000Z"
                    }
                ]
            };

            mockEventServices.getEventById.mockResolvedValue({
                "id": 11,
                "name": "Pilates",
                "description": "",
                "isVisible": true,
                "periods": [
                    {
                        "periodId": 22,
                        "startDateTime": "2024-11-25T22:00:00.000Z",
                        "endDateTime": "2024-11-25T23:00:00.000Z",
                        "alerts": []
                    }
                ],
                "members": [
                    {
                        "id": 1,
                        "name": "Dixie",
                        "color": "#E677C6"
                    },
                    {
                        "id": 3,
                        "name": "Candy",
                        "color": "#eab4f0"
                    }
                ]
            });
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getPeriodById.mockResolvedValue({
                "periodId": 22,
                "startDateTime": "2024-11-25T22:00:00.000Z",
                "endDateTime": "2024-11-25T23:00:00.000Z",
                "alerts": []
            })
            mockEventServices.updatePeriod.mockResolvedValue(mockUpdatedPeriod);

            const response = await request(app)
                .put('/families/my-family/events/11/periods/22')
                .send({
                    "startDateTime": "2024-11-25T22:00:00.000Z",
                    "endDateTime": "2024-11-25T23:00:00.000Z",
                    "alerts": [
                        "2024-11-25T21:30:00.000Z"
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(mockUpdatedPeriod);
        });

        it('should return 400 if validation fails', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);

            const response = await request(app)
                .put('/families/my-family/events/11/periods/22')
                .send({
                    "startDateTime": "2024-11-25T22:00:00.000Z",
                    "endDateTime": "2024-11-25T23:00:00.000Z",
                    "alerts": [
                        "2024-11-27T21:30:00.000Z"
                    ]
                })
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .put('/families/my-family/events/11/periods/22')
                .send({
                    "startDateTime": "2024-11-25T22:00:00.000Z",
                    "endDateTime": "2024-11-25T23:00:00.000Z",
                    "alerts": [
                        "2024-11-25T21:30:00.000Z"
                    ]
                })
                .expect('Content-Type', /json/)
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it('should return 500 if service fails', async () => {
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 11,
                    "name": "Pilates",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "periodId": 22,
                            "startDateTime": "2024-11-25T22:00:00.000Z",
                            "endDateTime": "2024-11-25T23:00:00.000Z",
                            "alerts": []
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });

            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getPeriodById.mockResolvedValue({
                "periodId": 22,
                "startDateTime": "2024-11-25T22:00:00.000Z",
                "endDateTime": "2024-11-25T23:00:00.000Z",
                "alerts": []
            })
            mockEventServices.updatePeriod.mockRejectedValue(new Error());

            await request(app)
                .put('/families/my-family/events/11/periods/22')
                .send({
                    "startDateTime": "2024-11-25T22:00:00.000Z",
                    "endDateTime": "2024-11-25T23:00:00.000Z",
                    "alerts": [
                        "2024-11-25T21:30:00.000Z"
                    ]
                })
                .expect(500);
        });
    });

    describe('DELETE /events/:id', () => {
        it('should delete the event and return an empty object', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 11,
                    "name": "Pilates",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "periodId": 22,
                            "startDateTime": "2024-11-25T22:00:00.000Z",
                            "endDateTime": "2024-11-25T23:00:00.000Z",
                            "alerts": []
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });
            mockEventServices.deleteEvent.mockResolvedValue();

            const response = await request(app)
                .delete('/families/my-family/events/11')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({});
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .delete('/families/my-family/events/11')
                .expect('Content-Type', /json/)
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it('should return 500 if service fails', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 11,
                    "name": "Pilates",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "periodId": 22,
                            "startDateTime": "2024-11-25T22:00:00.000Z",
                            "endDateTime": "2024-11-25T23:00:00.000Z",
                            "alerts": []
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });
            mockEventServices.deleteEvent.mockRejectedValue(new Error());

            await request(app)
                .delete('/families/my-family/events/11')
                .expect('Content-Type', /json/)
                .expect(500);
        });
    });

    describe('DELETE /events/:id/periods/:periodId', () => {
        it('should delete the period and return an empty object', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 10,
                    "name": "Yoga",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "id": 17,
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 13,
                                    "dateTime": "2024-11-12T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 18,
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 14,
                                    "dateTime": "2024-11-19T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 19,
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 15,
                                    "dateTime": "2024-11-26T21:30:00.000Z"
                                }
                            ]
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });
            mockEventServices.getPeriodById.mockResolvedValue({
                "id": 19,
                "startDateTime": "2024-11-26T22:00:00.000Z",
                "endDateTime": "2024-11-26T23:00:00.000Z",
                "alerts": [
                    {
                        "id": 15,
                        "dateTime": "2024-11-26T21:30:00.000Z"
                    }
                ]
            });
            mockEventServices.deletePeriod.mockResolvedValue();

            const response = await request(app)
                .delete('/families/my-family/events/10/periods/19')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({});
        });

        it('should return 403 if event is not in family', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(false);

            const response = await request(app)
                .delete('/families/my-family/events/10/periods/19')
                .expect('Content-Type', /json/)
                .expect(403);

            expect(response.body.message).toEqual('Accès non autorisé aux données de cet événement');
        });

        it('should return 500 if service fails', async () => {
            mockEventServices.isEventInFamily.mockResolvedValue(true);
            mockEventServices.getEventById.mockResolvedValue(
                {
                    "id": 10,
                    "name": "Yoga",
                    "description": "",
                    "isVisible": true,
                    "periods": [
                        {
                            "id": 17,
                            "startDateTime": "2024-11-12T22:00:00.000Z",
                            "endDateTime": "2024-11-12T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 13,
                                    "dateTime": "2024-11-12T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 18,
                            "startDateTime": "2024-11-19T22:00:00.000Z",
                            "endDateTime": "2024-11-19T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 14,
                                    "dateTime": "2024-11-19T21:30:00.000Z"
                                }
                            ]
                        },
                        {
                            "id": 19,
                            "startDateTime": "2024-11-26T22:00:00.000Z",
                            "endDateTime": "2024-11-26T23:00:00.000Z",
                            "alerts": [
                                {
                                    "id": 15,
                                    "dateTime": "2024-11-26T21:30:00.000Z"
                                }
                            ]
                        }
                    ],
                    "members": [
                        {
                            "id": 1,
                            "name": "Dixie",
                            "color": "#E677C6"
                        },
                        {
                            "id": 3,
                            "name": "Candy",
                            "color": "#eab4f0"
                        }
                    ]
                });
            mockEventServices.getPeriodById.mockResolvedValue({
                "id": 19,
                "startDateTime": "2024-11-26T22:00:00.000Z",
                "endDateTime": "2024-11-26T23:00:00.000Z",
                "alerts": [
                    {
                        "id": 15,
                        "dateTime": "2024-11-26T21:30:00.000Z"
                    }
                ]
            });
            mockEventServices.deletePeriod.mockRejectedValue(new Error());

            await request(app)
                .delete('/families/my-family/events/10/periods/19')
                .expect('Content-Type', /json/)
                .expect(500);
        });
    });
})