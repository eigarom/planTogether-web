const pool = require('../queries/dbPool');

class EventQueries {
    static async getEventsByFamilyId(familyId) {
        const result = await pool.query(
            `SELECT *
             FROM event
             WHERE id_family = $1`,
            [familyId]
        );
        return result.rows;
    }

    static async getPeriodsByEventId(eventId) {
        const result = await pool.query(
            `SELECT *
            FROM period
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getAlertsByEventId(eventId) {
        const result = await pool.query(
            `SELECT *
            FROM alert
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getMembersByEventId(eventId) {
        const result = await pool.query(
            `SELECT m.id_member, name, color
            FROM participation p
            INNER JOIN member m ON m.id_member = p.id_member
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getEventById(eventId) {
        const result = await pool.query(
            `SELECT *
             FROM event
             WHERE id_event = $1`,
            [eventId]
        );
        return result.rows[0];
    }

    static async isEventInFamily(eventId, familyId) {
        const result = await pool.query(
            `SELECT *
             FROM event
             WHERE id_event = $1
               AND id_family = $2`,
            [eventId, familyId]
        );
        return result.rowCount > 0;
    }

    static async createEvent(newEvent) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const eventId = await this.insertEvent(newEvent, client);
            await this.insertPeriods(eventId, newEvent.periods, client);
            await this.insertAlerts(eventId, newEvent.alerts, client);
            await this.insertParticipations(eventId, newEvent.members, client);
            await client.query("COMMIT");
            return eventId;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async insertEvent(event, client) {
        const result = await (client || pool).query(
            `INSERT INTO event(name, description, isvisible, id_family)
             VALUES ($1, $2, $3, $4)
             RETURNING id_event`,
            [event.name, event.description, event.isVisible, event.familyId]
        );

        return result.rows[0].id_event;
    }

    static async insertPeriods(eventId, periods, client) {
        try {
            // Boucle sur chaque période et exécute une requête d'insertion
            for (const period of periods) {
                console.log("Inserting period:", period.startDateTime, period.endDateTime);
                await (client || pool).query(
                    `INSERT INTO period (start_date_time, end_date_time, id_event)
                    VALUES ($1, $2, $3)`,
                    [period.startDateTime, period.endDateTime, eventId]
                );
            }
            console.log("Toutes les périodes ont été insérées avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'insertion des périodes :", error);
            throw error;
        }
    }

    static async insertAlerts(eventId, alerts, client) {
        try {
            // Boucle sur chaque dateTime du tableau d'alertes
            for (const dateTime of alerts) {
                await (client || pool).query(
                    `INSERT INTO alert (date_time, id_event)
                    VALUES ($1, $2)`,
                    [dateTime, eventId]
                );
            }
            console.log("Toutes les alertes ont été insérées avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'insertion des alertes :", error);
            throw error;
        }
    }

    static async insertParticipations(eventId, members, client) {
        try {
            // Boucle sur chaque memberId du tableau de membres
            for (const memberId of members) {
                await (client || pool).query(
                    `INSERT INTO participation (id_member, id_event)
                    VALUES ($1, $2)`,
                    [memberId, eventId]
                );
            }
            console.log("Toutes les participations ont été insérées avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'insertion des participations :", error);
            throw error;
        }
    }
}

module.exports = EventQueries;