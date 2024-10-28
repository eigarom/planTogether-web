const EventServices = require('../../src/services/EventServices');

jest.mock('../../src/queries/EventQueries');
const mockEventQueries = require('../../src/queries/EventQueries');

describe('Test event services', () => {
	describe('getEventById', () => {

        it('should return event information with valid event id', async () => {
			
            const mockEvent =
            {
                "id": 3,
                "name": "Concert",
                "description": "Aller au concert du soir.",
                "color": "#F7EF05",
                "isVisible": true,
            }

            const mockPeriods = [
                {
                    id_period: 3,
                    start_date_time: "2024-10-27T20:00:00.000Z",
                    end_date_time: "2024-10-27T22:00:00.000Z"
                },
                {
                    id_period: 5,
                    start_date_time: "2024-10-28T20:00:00.000Z",
                    end_date_time: "2024-10-28T22:00:00.000Z"
                }
            ];

            const mockAlerts = [];

            const mockMembers = [
                {
                    "id": 3,
                    "name": "Dixie"
                },
                {
                    "id": 4,
                    "name": "Diddy"
                }
            ]

            const mockEventDetails = {
                id: 3,
                name: "Concert",
                description: "Aller au concert du soir.",
                color: "#F7EF05",
                isVisible: true,
                periods: mockPeriods,
                alerts: mockAlerts,
                members: mockMembers
            };

			mockEventQueries.getEventByIdAndFamilyId.mockResolvedValue(mockEvent);
            mockEventQueries.getPeriodsByEventId.mockResolvedValue(mockPeriods);
            mockEventQueries.getAlertsByEventId.mockResolvedValue(mockAlerts);
            mockEventQueries.getMembersByEventId.mockResolvedValue(mockMembers);

			const eventDetails = await EventServices.getEventByIds('eventId','familyId');
			expect(eventDetails).toEqual(mockEventDetails);
		});

		it('should return "undefined" if event id not found', async () => {
			mockEventQueries.getEventByIdAndFamilyId.mockResolvedValue(undefined);
			const familyDetails = await EventServices.getEventByIds('eventId','familyId');
			expect(familyDetails).toBeUndefined();
		});
	});
});