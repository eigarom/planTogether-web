const EventQueries = require("../queries/EventQueries");

class EventServices {
    static async getEventsByIdFamily(familyId) {
        const result = await EventQueries.getEventsByFamilyId(familyId);

        if (result) {
            const events = await Promise.all(result.map(async (row) => {

                const periods = await EventQueries.getPeriodsByEventId(row.id_event);
                const formattedPeriods = periods.map(period => ({
                    id: period.id_period,
                    startDateTime: period.start_date_time,
                    endDateTime: period.end_date_time,
                }));

                const alerts = await EventQueries.getAlertsByEventId(row.id_event);
                const formattedAlerts = alerts.map(alert => ({
                    id: alert.id_alert,
                    dateTime: alert.date_time,
                }));

                const members = await EventQueries.getMembersByEventId(row.id_event);
                const formattedMembers = members.map(member => ({
                    id: member.id_member,
                    name: member.name,
                    color: member.color
                }));

                return {
                    id: row.id_event,
                    name: row.name,
                    description: row.description,
                    isVisible: row.isvisible,
                    periods: formattedPeriods || [],
                    alerts: formattedAlerts || [],
                    members: formattedMembers || []
                };
            }));
            return events;
        }
        return undefined;
    }

    static async getEventById(eventId) {
        const result = await EventQueries.getEventById(eventId);

        if (result) {
            const periods = await EventQueries.getPeriodsByEventId(eventId);
            const formattedPeriods = periods.map(period => ({
                id: period.id_period,
                startDateTime: period.start_date_time,
                endDateTime: period.end_date_time,
            }));

            const alerts = await EventQueries.getAlertsByEventId(eventId);
            const formattedAlerts = alerts.map(alert => ({
                id: alert.id_alert,
                dateTime: alert.date_time,
            }));

            const members = await EventQueries.getMembersByEventId(eventId);
            const formattedMembers = members.map(member => ({
                id: member.id_member,
                name: member.name,
                color: member.color
            }));

            const event = {
                id: result.id_event,
                name: result.name,
                description: result.description,
                isVisible: result.isvisible,
                periods: formattedPeriods || [],
                alerts: formattedAlerts || [],
                members: formattedMembers || []
            };
            return event;
        }
        return undefined;
    }

    static async isEventInFamily(eventId, familyId) {
		return await EventQueries.isEventInFamily(eventId, familyId);
	}

    static async createEvent(newEvent) {
		const newEventId = await EventQueries.createEvent(newEvent);

		return this.getEventById(newEventId);
	}
}

module.exports = EventServices;