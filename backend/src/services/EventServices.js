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
                    name: member.name
                }));

                return {
                    id: row.id_event,
                    name: row.name,
                    description: row.description,
                    color: row.color,
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

    static async getEventByIds(eventId, familyId) {
        const result = await EventQueries.getEventByIdAndFamilyId(eventId, familyId);

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
                name: member.name
            }));

            const event = {
                id: result.id_event,
                name: result.name,
                description: result.description,
                color: result.color,
                isVisible: result.isvisible,
                periods: formattedPeriods || [],
                alerts: formattedAlerts || [],
                members: formattedMembers || []
            };
            return event;
        }
        return undefined;
    }
}

module.exports = EventServices;