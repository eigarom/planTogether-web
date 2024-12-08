const EventServices = require('../../src/services/EventServices');

jest.mock('../../src/queries/EventQueries');
const mockEventQueries = require('../../src/queries/EventQueries');

describe('Test event services', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getEventsByIdFamily', () => {
		const mockEvents = [
			{ id_event: 1, name: 'Event 1', description: 'Description 1', isvisible: true },
			{ id_event: 2, name: 'Event 2', description: 'Description 2', isvisible: false }
		];

		const mockPeriods = [
			{ id_period: 1, start_date_time: '2024-12-08T10:00:00Z', end_date_time: '2024-12-08T12:00:00Z' },
			{ id_period: 2, start_date_time: '2024-12-09T14:00:00Z', end_date_time: '2024-12-09T16:00:00Z' }
		];

		const mockAlerts = [
			{ id_alert: 1, date_time: '2024-12-08T09:45:00Z' },
			{ id_alert: 2, date_time: '2024-12-09T13:45:00Z' }
		];

		const mockMembers = [
			{ id_member: 1, name: 'Member 1', color: 'red' },
			{ id_member: 2, name: 'Member 2', color: 'blue' }
		];

		it('should return events with detailed information', async () => {
			jest.spyOn(mockEventQueries, 'getEventsByFamilyId').mockResolvedValue(mockEvents);
			jest.spyOn(mockEventQueries, 'getPeriodsByEventId').mockResolvedValue(mockPeriods);
			jest.spyOn(mockEventQueries, 'getAlertsByPeriodId').mockResolvedValue(mockAlerts);
			jest.spyOn(mockEventQueries, 'getMembersByEventId').mockResolvedValue(mockMembers);

			const expectedResult = [
				{
					id: 1,
					name: 'Event 1',
					description: 'Description 1',
					isVisible: true,
					periods: [
						{
							id: 1,
							startDateTime: '2024-12-08T10:00:00Z',
							endDateTime: '2024-12-08T12:00:00Z',
							alerts: [
								{ id: 1, dateTime: '2024-12-08T09:45:00Z' },
								{ id: 2, dateTime: '2024-12-09T13:45:00Z' }
							]
						},
						{
							id: 2,
							startDateTime: '2024-12-09T14:00:00Z',
							endDateTime: '2024-12-09T16:00:00Z',
							alerts: [
								{ id: 1, dateTime: '2024-12-08T09:45:00Z' },
								{ id: 2, dateTime: '2024-12-09T13:45:00Z' }
							]
						}
					],
					members: [
						{ id: 1, name: 'Member 1', color: 'red' },
						{ id: 2, name: 'Member 2', color: 'blue' }
					]
				},
				{
					id: 2,
					name: 'Event 2',
					description: 'Description 2',
					isVisible: false,
					periods: [
						{
							id: 1,
							startDateTime: '2024-12-08T10:00:00Z',
							endDateTime: '2024-12-08T12:00:00Z',
							alerts: [
								{ id: 1, dateTime: '2024-12-08T09:45:00Z' },
								{ id: 2, dateTime: '2024-12-09T13:45:00Z' }
							]
						},
						{
							id: 2,
							startDateTime: '2024-12-09T14:00:00Z',
							endDateTime: '2024-12-09T16:00:00Z',
							alerts: [
								{ id: 1, dateTime: '2024-12-08T09:45:00Z' },
								{ id: 2, dateTime: '2024-12-09T13:45:00Z' }
							]
						}
					],
					members: [
						{ id: 1, name: 'Member 1', color: 'red' },
						{ id: 2, name: 'Member 2', color: 'blue' }
					]
				}
			];

			const result = await EventServices.getEventsByIdFamily('familyId');
			expect(result).toEqual(expectedResult);
		});

		it('should return undefined if no events are found for the family ID', async () => {
			jest.spyOn(mockEventQueries, 'getEventsByFamilyId').mockResolvedValue(undefined);

			const result = await EventServices.getEventsByIdFamily('familyId');
			expect(result).toBeUndefined();
		});
	});

	describe('getEventWithPeriodId', () => {
		const mockEvent = { id_event: 1, name: 'Event 1', description: 'Description 1', isvisible: true };
		const mockPeriod = { id_period: 10, start_date_time: '2024-12-08T10:00:00Z', end_date_time: '2024-12-08T12:00:00Z' };
		const mockAlerts = [
			{ id_alert: 1, date_time: '2024-12-08T09:45:00Z' },
			{ id_alert: 2, date_time: '2024-12-08T11:45:00Z' }
		];
		const mockMembers = [
			{ id_member: 1, name: 'Member 1', color: 'red' },
			{ id_member: 2, name: 'Member 2', color: 'blue' }
		];

		it('should return detailed event information with period and alerts', async () => {
			jest.spyOn(mockEventQueries, 'getEventById').mockResolvedValue(mockEvent);
			jest.spyOn(mockEventQueries, 'getPeriodById').mockResolvedValue(mockPeriod);
			jest.spyOn(mockEventQueries, 'getAlertsByPeriodId').mockResolvedValue(mockAlerts);
			jest.spyOn(mockEventQueries, 'getMembersByEventId').mockResolvedValue(mockMembers);

			const expectedResult = {
				id: 1,
				name: 'Event 1',
				description: 'Description 1',
				isVisible: true,
				period: {
					id: 10,
					startDateTime: '2024-12-08T10:00:00Z',
					endDateTime: '2024-12-08T12:00:00Z',
					alerts: [
						{ id: 1, dateTime: '2024-12-08T09:45:00Z' },
						{ id: 2, dateTime: '2024-12-08T11:45:00Z' }
					]
				},
				members: [
					{ id: 1, name: 'Member 1', color: 'red' },
					{ id: 2, name: 'Member 2', color: 'blue' }
				]
			};

			const result = await EventServices.getEventWithPeriodId(1, 10);
			expect(result).toEqual(expectedResult);
		});

		it('should return undefined if event is not found', async () => {
			jest.spyOn(mockEventQueries, 'getEventById').mockResolvedValue(undefined);

			const result = await EventServices.getEventWithPeriodId(1, 10);
			expect(result).toBeUndefined();
		});
	});

	describe('isEventInFamily', () => {
		it('should return true if the event belongs to the family', async () => {
			jest.spyOn(mockEventQueries, 'isEventInFamily').mockResolvedValue(true);

			const result = await EventServices.isEventInFamily(1, 1);
			expect(result).toBe(true);
		});

		it('should return false if the event does not belong to the family', async () => {
			jest.spyOn(mockEventQueries, 'isEventInFamily').mockResolvedValue(false);

			const result = await EventServices.isEventInFamily(999, 1);
			expect(result).toBe(false);
		});

		it('should handle errors thrown by the database query', async () => {
			jest.spyOn(mockEventQueries, 'isEventInFamily').mockRejectedValue(new Error('Database error'));

			await expect(EventServices.isEventInFamily(1, 1)).rejects.toThrow('Database error');
		});
	});

	describe('createEvent', () => {
		const mockNewEvent = {
			name: 'New Event',
			description: 'Test Description',
			periods: [
				{ startDateTime: '2024-12-08T10:00:00Z', endDateTime: '2024-12-08T12:00:00Z' }
			],
			members: [{ id: 1 }, { id: 2 }]
		};
	
		const mockCreatedEvent = {
			id: 123,
			name: 'New Event',
			description: 'Test Description',
			periods: [
				{ id: 10, startDateTime: '2024-12-08T10:00:00Z', endDateTime: '2024-12-08T12:00:00Z' }
			],
			members: [
				{ id: 1, name: 'Member 1', color: 'red' },
				{ id: 2, name: 'Member 2', color: 'blue' }
			]
		};
	
		it('should create a new event and return it', async () => {
			jest.spyOn(mockEventQueries, 'createEvent').mockResolvedValue(123);
			jest.spyOn(EventServices, 'getEventById').mockResolvedValue(mockCreatedEvent);
	
			const result = await EventServices.createEvent(mockNewEvent);
			expect(result).toEqual(mockCreatedEvent);
	
			expect(mockEventQueries.createEvent).toHaveBeenCalledWith(mockNewEvent);
			expect(EventServices.getEventById).toHaveBeenCalledWith(123);
		});
	
		it('should throw an error if event creation fails', async () => {
			jest.spyOn(mockEventQueries, 'createEvent').mockRejectedValue(new Error('Database error'));
			jest.spyOn(EventServices, 'getEventById');

			await expect(EventServices.createEvent(mockNewEvent)).rejects.toThrow('Database error');
	
			expect(EventServices.getEventById).not.toHaveBeenCalled();
		});
	
		it('should throw an error if getEventById fails', async () => {
			// Simuler un `id_event` valide mais une erreur dans `getEventById`
			jest.spyOn(mockEventQueries, 'createEvent').mockResolvedValue(123);
			jest.spyOn(EventServices, 'getEventById').mockRejectedValue(new Error('Fetch error'));
	
			await expect(EventServices.createEvent(mockNewEvent)).rejects.toThrow('Fetch error');
		});
	});

	describe('updateEvent', () => {
		const mockUpdatedEvent = {
			id: 123,
			name: 'Updated Event',
			description: 'Updated Description',
			members: [{ id: 1 }, { id: 2 }]
		};
	
		const mockFetchedEvent = {
			id: 123,
			name: 'Updated Event',
			description: 'Updated Description',
			periods: [
				{ id: 10, startDateTime: '2024-12-08T10:00:00Z', endDateTime: '2024-12-08T12:00:00Z' }
			],
			members: [
				{ id: 1, name: 'Member 1', color: 'red' },
				{ id: 2, name: 'Member 2', color: 'blue' }
			]
		};
	
		it('should update the event and return the updated event', async () => {
			jest.spyOn(mockEventQueries, 'updateEvent').mockResolvedValue(true);
			jest.spyOn(EventServices, 'getEventById').mockResolvedValue(mockFetchedEvent);
	
			const result = await EventServices.updateEvent(mockUpdatedEvent);
	
			expect(result).toEqual(mockFetchedEvent);
	
			expect(mockEventQueries.updateEvent).toHaveBeenCalledWith(mockUpdatedEvent);
			expect(EventServices.getEventById).toHaveBeenCalledWith(123);
		});
	
		it('should throw an error if event update fails', async () => {
			// Simuler un échec dans `updateEvent`
			jest.spyOn(mockEventQueries, 'updateEvent').mockResolvedValue(false);
			jest.spyOn(EventServices, 'getEventById');
	
			await expect(EventServices.updateEvent(mockUpdatedEvent)).rejects.toThrow(
				'Erreur lors de la mise à jour de l\'événement'
			);
	
			// Vérifier que `getEventById` n'est pas appelé
			expect(EventServices.getEventById).not.toHaveBeenCalled();
		});
	
		it('should throw an error if an exception occurs during update', async () => {
			// Simuler une exception dans `updateEvent`
			jest.spyOn(mockEventQueries, 'updateEvent').mockRejectedValue(new Error('Database error'));
			jest.spyOn(EventServices, 'getEventById');
	
			await expect(EventServices.updateEvent(mockUpdatedEvent)).rejects.toThrow('Database error');
	
			// Vérifier que `getEventById` n'est pas appelé
			expect(EventServices.getEventById).not.toHaveBeenCalled();
		});
	});
	
	describe('updatePeriod', () => {
		const mockUpdatedPeriod = {
			periodId: 1,
			eventId: 123,
			startDateTime: '2024-12-09T10:00:00Z',
			endDateTime: '2024-12-09T12:00:00Z',
			alerts: [{ id: 1, dateTime: '2024-12-09T09:30:00Z' }]
		};
	
		const mockFetchedPeriod = {
			periodId: 1,
			startDateTime: '2024-12-09T10:00:00Z',
			endDateTime: '2024-12-09T12:00:00Z',
			alerts: [{ id: 1, dateTime: '2024-12-09T09:30:00Z' }]
		};
	
		it('should update the period and return the updated period', async () => {
			jest.spyOn(mockEventQueries, 'updatePeriod').mockResolvedValue(true);
			jest.spyOn(EventServices, 'getPeriodById').mockResolvedValue(mockFetchedPeriod);
	
			const result = await EventServices.updatePeriod(mockUpdatedPeriod);
	
			expect(result).toEqual(mockFetchedPeriod);
			expect(mockEventQueries.updatePeriod).toHaveBeenCalledWith(mockUpdatedPeriod);
			expect(EventServices.getPeriodById).toHaveBeenCalledWith(1, 123);
		});
	
		it('should throw an error if period update fails', async () => {
			jest.spyOn(mockEventQueries, 'updatePeriod').mockResolvedValue(false);
			jest.spyOn(EventServices, 'getPeriodById');
	
			await expect(EventServices.updatePeriod(mockUpdatedPeriod)).rejects.toThrow(
				'Erreur lors de la mise à jour de la période'
			);
	
			expect(EventServices.getPeriodById).not.toHaveBeenCalled();
		});
	
		it('should throw an error if an exception occurs during update', async () => {
			jest.spyOn(mockEventQueries, 'updatePeriod').mockRejectedValue(new Error('Database error'));
			jest.spyOn(EventServices, 'getPeriodById');
	
			await expect(EventServices.updatePeriod(mockUpdatedPeriod)).rejects.toThrow('Database error');
	
			expect(EventServices.getPeriodById).not.toHaveBeenCalled();
		});
	});

	describe('deleteEvent', () => {
		const eventId = 123;
	
		it('should delete the event successfully', async () => {
			jest.spyOn(mockEventQueries, 'deleteEvent').mockResolvedValue();
			jest.spyOn(EventServices, 'getEventById').mockResolvedValue(undefined);
	
			await EventServices.deleteEvent(eventId);
	
			expect(mockEventQueries.deleteEvent).toHaveBeenCalledWith(eventId);
			expect(EventServices.getEventById).toHaveBeenCalledWith(eventId);
		});
	
		it('should throw an error if the event is not deleted', async () => {
			jest.spyOn(mockEventQueries, 'deleteEvent').mockResolvedValue();
			jest.spyOn(EventServices, 'getEventById').mockResolvedValue({ id: eventId });
	
			await expect(EventServices.deleteEvent(eventId)).rejects.toThrow(
				'Erreur lors de la suppression de l\'événement'
			);
	
			expect(EventServices.getEventById).toHaveBeenCalledWith(eventId);
		});
	});
	
	describe('getPeriodById', () => {
		const periodId = 1;
		const eventId = 123;
	
		const mockFetchedPeriod = {
			id_period: 1,
			start_date_time: '2024-12-09T10:00:00Z',
			end_date_time: '2024-12-09T12:00:00Z'
		};
	
		const mockFetchedAlerts = [
			{ id_alert: 1, date_time: '2024-12-09T09:30:00Z' }
		];
	
		const expectedFormattedPeriod = {
			periodId: 1,
			startDateTime: '2024-12-09T10:00:00Z',
			endDateTime: '2024-12-09T12:00:00Z',
			alerts: [{ id: 1, dateTime: '2024-12-09T09:30:00Z' }]
		};
	
		it('should return the formatted period with alerts', async () => {
			jest.spyOn(mockEventQueries, 'getPeriodById').mockResolvedValue(mockFetchedPeriod);
			jest.spyOn(mockEventQueries, 'getAlertsByPeriodId').mockResolvedValue(mockFetchedAlerts);
	
			const result = await EventServices.getPeriodById(periodId, eventId);
	
			expect(result).toEqual(expectedFormattedPeriod);
			expect(mockEventQueries.getPeriodById).toHaveBeenCalledWith(periodId, eventId);
			expect(mockEventQueries.getAlertsByPeriodId).toHaveBeenCalledWith(periodId);
		});
	
		it('should return undefined if the period is not found', async () => {
			jest.spyOn(mockEventQueries, 'getPeriodById').mockResolvedValue(undefined);
	
			const result = await EventServices.getPeriodById(periodId, eventId);
	
			expect(result).toBeUndefined();
			expect(mockEventQueries.getAlertsByPeriodId).not.toHaveBeenCalled();
		});
	});

	describe('deletePeriod', () => {
		const periodId = 1;
		const eventId = 123;
	
		it('should delete the period successfully', async () => {
			jest.spyOn(mockEventQueries, 'deletePeriod').mockResolvedValue();
			jest.spyOn(EventServices, 'getPeriodById').mockResolvedValue(undefined);
	
			await EventServices.deletePeriod(periodId, eventId);
	
			expect(mockEventQueries.deletePeriod).toHaveBeenCalledWith(periodId, eventId);
			expect(EventServices.getPeriodById).toHaveBeenCalledWith(periodId, eventId);
		});
	
		it('should throw an error if the period is not deleted', async () => {
			jest.spyOn(mockEventQueries, 'deletePeriod').mockResolvedValue();
			jest.spyOn(EventServices, 'getPeriodById').mockResolvedValue({
				periodId,
				startDateTime: '2024-12-09T10:00:00Z',
				endDateTime: '2024-12-09T12:00:00Z'
			});
	
			await expect(EventServices.deletePeriod(periodId, eventId)).rejects.toThrow(
				'Erreur lors de la suppression de la période'
			);
	
			expect(EventServices.getPeriodById).toHaveBeenCalledWith(periodId, eventId);
		});
	});	
	
});