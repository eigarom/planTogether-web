export async function getEventsList(token) {
    const response = await fetch('/api/families/my-family/events', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();

    if (response.ok) {
        const events = result.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            isVisible: event.isVisible,
            periods: event.periods.map(period => ({
                id: period.id,
                startDateTime: period.startDateTime,
                endDateTime: period.endDateTime
            })),
            alerts: event.alerts.map(alert => ({
                id: alert.id,
                dateTime: alert.dateTime
            })),
            members: event.members.map(member => ({
                id: member.id,
                name: member.name,
                color: member.color
            }))
        }));

        return events;

    } else {
        throw new Error(result.message || 'Erreur lors de l\'obtention de la liste des événements');
    }
}

export async function getEvent(token, idEvent) {
    const response = await fetch(`/api/families/my-family/events/${idEvent}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();

    if (response.ok) {
        const event = {
            id: result.id,
            name: result.name,
            description: result.description,
            isVisible: result.isVisible,
            periods: result.periods.map(period => ({
                id: period.id,
                startDateTime: period.startDateTime,
                endDateTime: period.endDateTime
            })),
            alerts: result.alerts.map(alert => ({
                id: alert.id,
                dateTime: alert.dateTime
            })),
            members: result.members.map(member => ({
                id: member.id,
                name: member.name,
                color: member.color
            }))
        };

        return event;

    } else {
        throw new Error(result.message || `Erreur lors de l'obtention de l'événement ${idEvent}`);
    }
}

export async function createEvent(eventDetails, token) {
	const response = await fetch("/api/families/my-family/events", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(eventDetails),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "L'événement n'a pas pu être créé:");
	}
}