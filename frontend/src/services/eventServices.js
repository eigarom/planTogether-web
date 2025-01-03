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
                endDateTime: period.endDateTime,
                alerts: period.alerts.map(alert => ({
                    id: alert.id,
                    dateTime: alert.dateTime
                })),
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

export async function getEvent(token, eventId, periodId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}/periods/${periodId}`, {
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
            period: {
                id: result.period.id,
                startDateTime: result.period.startDateTime,
                endDateTime: result.period.endDateTime,
                alerts: result.period.alerts.map(alert => ({
                    id: alert.id,
                    dateTime: alert.dateTime
                })),
            },
            members: result.members.map(member => ({
                id: member.id,
                name: member.name,
                color: member.color
            }))
        };

        return event;

    } else {
        throw new Error(result.message || `Erreur lors de l'obtention de l'événement ${eventId}`);
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

export async function updateEventById(token, eventDetails, eventId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}`, {
        method: "PUT",
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
        throw new Error(result.message || "L'événement n'a pas pu être mis à jour:");
    }
}

export async function updatePeriodById(token, periodDetails, periodId, eventId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}/periods/${periodId}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(periodDetails),
    });
    const result = await response.json();

    if (response.ok) {
        return result;
    } else {
        throw new Error(result.message || "La période n'a pas pu être mise à jour:");
    }
}

export async function deleteEvent(token, eventId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "L'événement n'a pas pu être supprimé");
    }
}

export async function deletePeriod(token, eventId, periodId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}/periods/${periodId}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "La période de l'événement n'a pas pu être supprimée");
    }
}

export async function getNumberOfPeriodsByEventId(token, eventId) {
    const response = await fetch(`/api/families/my-family/events/${eventId}/periods`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await response.json();

    if (response.ok) {
        return result.numberOfPeriods;
    } else {
        throw new Error(result.message || `Erreur lors de l'obtention du nombre de périodes de l'événement ${eventId}`);
    }
}