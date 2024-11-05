<template>
    <div>
        <div>
            <router-link :to="eventDetailsUrl(id)">
                <div>{{ name }}</div>
                <div v-for="period in sortedPeriods" :key="period.id">
                    Début : {{ formatTime(period.startDateTime) }} - Fin : {{ formatTime(period.endDateTime) }}
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: Number,
        name: String,
        periods: Array
    },
    methods: {
        formatTime(dateTime) {
            const date = new Date(dateTime);
            return date.toISOString().split('T')[1].substring(0, 5);
        },
        eventDetailsUrl(eventId) {
            return { name: 'EventDetails', params: { id: eventId } };
        }
    },
    computed: {
        sortedPeriods() {
            const sorted = [...this.periods].sort((a, b) => {
                const aDate = new Date(a.startDateTime);
                const bDate = new Date(b.startDateTime);
                return bDate - aDate;
            });
            return sorted;
        }
    }
};
</script>
