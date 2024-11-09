const EventServices = require('../../src/services/EventServices');

jest.mock('../../src/queries/EventQueries');
const mockEventQueries = require('../../src/queries/EventQueries');

describe('Test event services', () => {
	describe('getEventById', () => {

		it('should return "undefined" if event id not found', async () => {
			mockEventQueries.getEventById.mockResolvedValue(undefined);
			const familyDetails = await EventServices.getEventById('eventId');
			expect(familyDetails).toBeUndefined();
		});
	});
});