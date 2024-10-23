export async function fetchEventsList(token) {
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
            color: event.color,
            isVisible: event.isVisible,
            periods: event.periods.map(period => ({
                id: period.id,
                startDateTime: period.startDateTime,
                endDateTime: period.endDateTime
            })),
            alerts: event.alerts.map(alert => ({
                id: alert.id,
                dateTime: alert.dateTime
            }))
        }));

        return events;

    } else {
        throw new Error(result.message || 'Erreur lors de l\'obtention de la liste des événements');
    }
}

export async function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Date(dateString).toLocaleDateString(undefined, options).replace(' at ', ' ');
}