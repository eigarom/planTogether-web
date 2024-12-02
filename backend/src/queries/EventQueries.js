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

    static async getAlertsByPeriodId(periodId) {
        const result = await pool.query(
            `SELECT *
            FROM alert
            WHERE id_period = $1`,
            [periodId]
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

    static async getPeriodById(periodId, eventId) {
        const result = await pool.query(
            `SELECT *
            FROM period
            WHERE id_period = $1 AND id_event = $2`,
            [periodId, eventId]
        );
        return result.rows[0];
    }

    static async getNumberOfPeriodsByEventId(eventId) {
        const result = await pool.query(
            `SELECT COUNT(id_period)
            FROM period
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
            const periodIds = [];

            // Boucle sur chaque période et exécute une requête d'insertion
            for (const period of periods) {

                const result = await (client || pool).query(
                    `INSERT INTO period (start_date_time, end_date_time, id_event)
                    VALUES ($1, $2, $3)
                    RETURNING id_period`,
                    [period.startDateTime, period.endDateTime, eventId]
                );
                // Récupération de l'id_period
                const periodId = result.rows[0].id_period;

                await this.insertAlerts(periodId, period.alerts, client);
            }
            console.log("Toutes les périodes ont été insérées avec succès.");
            return periodIds;
        } catch (error) {
            console.error("Erreur lors de l'insertion des périodes :", error);
            throw error;
        }
    }

    static async insertAlerts(periodId, alerts, client) {
        try {
            // Boucle sur chaque dateTime du tableau d'alertes
            for (const dateTime of alerts) {
                await (client || pool).query(
                    `INSERT INTO alert (date_time, id_period)
                    VALUES ($1, $2)`,
                    [dateTime, periodId]
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

    static async updateEvent(updatedEvent) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            
            await this.updateEventTable(updatedEvent, client);

            await this.updateParticipations(updatedEvent.id, updatedEvent.members, client);

            await client.query("COMMIT");

            return true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async updateEventTable(event, client) {
        const result = await (client || pool).query(
            `UPDATE event
            SET name = $2,
                description = $3,
                isvisible = $4
            WHERE id_event = $1`,
            [event.id, event.name, event.description, event.isVisible]
        );

        return result.rowCount > 0;
    }

    static async updateParticipations(eventId, members, client) {
        try {
            await this.deleteParticipations(eventId, client);
            await this.insertParticipations(eventId, members, client);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des participations :", error);
            throw error;
        }
    }

    static async updatePeriod(updatedPeriod) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            
            await this.updatePeriodTable(updatedPeriod, client);

            await this.updateAlerts(updatedPeriod.periodId, updatedPeriod.alerts, client);

            await client.query("COMMIT");

            return true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async updatePeriodTable(period, client) {
        const result = await (client || pool).query(
            `UPDATE period
            SET start_date_time = $3,
                end_date_time = $4
            WHERE id_period= $1 AND id_event = $2`,
            [period.periodId, period.eventId, period.startDateTime, period.endDateTime]
        );

        return result.rowCount > 0;
    }

    static async updateAlerts(periodId, alerts, client) {
        try {
            await this.deleteAlertsByPeriodId(periodId, client);
            await this.insertAlerts(periodId, alerts, client);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des participations :", error);
            throw error;
        }
    }

    static async deleteEvent(eventId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await this.deleteInEventTable(eventId, client);
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async deleteInEventTable(eventId, client) {
        const result = await (client || pool).query(
            `DELETE
             FROM event
             WHERE id_event = $1`,
            [eventId]
        );
        return result.rowCount > 0;
    }

    static async deletePeriod(periodId, eventId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            await this.deletePeriodById(periodId, eventId, client);

            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async deletePeriodById(periodId, eventId, client) {
        const result = await (client || pool).query(
            `DELETE
            FROM period
            WHERE id_period = $1 AND id_event = $2`,
            [periodId, eventId]
        );
        return result.rowCount > 0;
    }

    static async deleteAlertsByPeriodId(periodId, client) {
        const result = await (client || pool).query(
            `DELETE
            FROM alert
            WHERE id_period = $1`,
            [periodId]
        );
        return result.rowCount > 0;
    }
}

module.exports = EventQueries;