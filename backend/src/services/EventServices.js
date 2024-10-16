const EventQueries = require("../queries/EventQueries");

class EventServices {
	static async getEventsByIdFamily() {
		const result = await EventQueries.getEventsByIdFamily(email);

		if (result) {
            const events = result.map(row => {
                return {
                    id: row.id_event,
                    name: row.name,
                    description: row.description,
                    color: row.color,
                    isVisible: row.isvisible,
                    periods: [],
                    alerts: []
                };
            })
            
		}
		return undefined;
	}
}

module.exports = EventServices;