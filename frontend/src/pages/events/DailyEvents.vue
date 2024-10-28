<template>
    <div>
        <div :style="{ backgroundColor: color, padding: '10px', borderRadius: '5px', marginBottom: '10px' }">
            <div>{{ name }}</div>
            <div v-for="period in sortedPeriods" :key="period.id">
                Début : {{ formatTime(period.startDateTime) }} - Fin : {{ formatTime(period.endDateTime) }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: Number,
        name: String,
        color: String,
        periods: Array
    },
    methods: {
        isToday(date) {
            const today = new Date().setHours(0, 0, 0, 0);
            return date === today;
        },
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
            console.log("Periods avant tri:", this.periods);

            if (!Array.isArray(this.periods) || this.periods.length === 0) {
            console.warn("Periods is not a valid array:", this.periods);
            return [];
        }
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

<style scoped>
.highlighted-date {
    font-weight: bold;
    color: #2c7a7b;
}
</style>
