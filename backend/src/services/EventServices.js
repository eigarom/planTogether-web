const EventQueries = require("../queries/EventQueries");

class EventServices {
    static async getEventsByIdFamily(familyId) {
        const result = await EventQueries.getEventsByFamilyId(familyId);

        if (result) {
            const events = await Promise.all(result.map(async (row) => {

                const periods = await EventQueries.getPeriodsByEventId(row.id_event);

                const formattedPeriods = await Promise.all(periods.map(async (period) => {
                    const alerts = await EventQueries.getAlertsByPeriodId(period.id_period);
                    const formattedAlerts = alerts.map(alert => ({
                        id: alert.id_alert,
                        dateTime: alert.date_time,
                    }));

                    return {
                        id: period.id_period,
                        startDateTime: period.start_date_time,
                        endDateTime: period.end_date_time,
                        alerts: formattedAlerts
                    };
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
                        periods: formattedPeriods,
                        members: formattedMembers
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

            const formattedPeriods = await Promise.all(periods.map(async (period) => {
                    const alerts = await EventQueries.getAlertsByPeriodId(period.id_period);
                    const formattedAlerts = alerts.map(alert => ({
                        id: alert.id_alert,
                        dateTime: alert.date_time,
                    }));

                    return {
                        id: period.id_period,
                        startDateTime: period.start_date_time,
                        endDateTime: period.end_date_time,
                        alerts: formattedAlerts
                    };
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
                periods: formattedPeriods,
                members: formattedMembers
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

    static async deleteEvent(eventId) {
        await EventQueries.deleteEvent(eventId);
        if (await this.getEventById(eventId)) {
            throw new Error("Erreur lors de la suppression de l'événement");
        }
    }

    static async getPeriodById(periodId, eventId) {
        const result = await EventQueries.getPeriodById(periodId, eventId);

        if (result) {
            return {
                periodId: result.name,
                startDateTime: result.start_date_time,
                endDateTime: result.end_date_time,
            }
        }
        return undefined;
    }
}

module.exports = EventServices;