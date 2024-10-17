const EventQueries = require("../queries/EventQueries");

class EventServices {
    static async getEventsByIdFamily(familyId) {
        const result = await EventQueries.getEventsByIdFamily(familyId);

        if (result) {
            const events = await Promise.all(result.map(async (row) => {
                
                const periods = await EventQueries.getPeriodsByIdEvent(row.id_event);
                const formattedPeriods = periods.map(period => ({
                    id: period.id_period,
                    startDateTime: period.start_date_time,
                    endDateTime: period.end_date_time,
                }));
                
                const alerts = await EventQueries.getAlertsByIdEvent(row.id_event);
                const formattedAlerts = alerts.map(alert => ({
                    id: alert.id_alert,
                    dateTime: alert.date_time,
                }));

                return {
                    id: row.id_event,
                    name: row.name,
                    description: row.description,
                    color: row.color,
                    isVisible: row.isvisible,
                    periods: formattedPeriods || [],
                    alerts: formattedAlerts || []
                };
            }));
            return events;
        }
        return undefined;
    }
}

module.exports = EventServices;