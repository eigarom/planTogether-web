const pool = require('../queries/dbPool');

class EventQueries {
	static async getEventsByIdFamily(familyId) {
		const result = await pool.query(
			`SELECT *
             FROM event
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows;
	}

    static async getPeriodsByIdEvent(eventId) {
        const result = await pool.query(
            `SELECT *
            FROM period
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }
}

module.exports = EventQueries;