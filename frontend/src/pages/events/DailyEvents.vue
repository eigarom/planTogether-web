<template>
    <div class="border m-3">
        <h2 class="text-xl mb-4 text-center">{{ id }}</h2>
        <div v-for="event in events" :key="event.id" class="text-l mb-4 text-center"> 
            <router-link :to="`events/${event.id}/periods/${event.period.id}`">
                <div>{{ event.name }}</div>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: String,
        events: Array
    },
    methods: {
        formatTime(dateTime) {
            const date = new Date(dateTime);
            return date.toISOString().split('T')[1].substring(0, 5);
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
