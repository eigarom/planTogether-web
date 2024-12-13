<template>
    <div>
        <div class="flex justify-center items-center mb-4 text-xl font-bold">
            {{ formattedYear }}
        </div>
        <div class="flex justify-between items-center mb-4">
            <button @click="previousWeek">← {{ $t('previousWeek') }}</button>
            <h2>{{ formattedWeek }}</h2>
            <button @click="nextWeek">→ {{ $t('nextWeek') }}</button>
        </div>
        <div class="grid grid-cols-7 gap-2 border">
            <div v-for="i in 7" :key="i" class="border text-center font-bold">
                {{ getDayLetter(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + (i - 1))) }}
            </div>
            <div v-for="day in week" :key="day.id" class="border p-2">
                <h3 class="flex justify-center">{{ getDayNumber(day.date) }}</h3>
                <div v-for="event in day.events" :key="event.id" class="bg-blue-100 p-1 rounded mb-2">
                    <router-link :to="`/events/${event.id}/periods/${event.period.id}`">
                        {{ event.name }}
                        <div class="flex items-center gap-1">
                            <div v-for="member in event.members" :key="member.id">
                                <Avatar v-if="member.imageUrl" :image="member.imageUrl" shape="circle" size="small"
                                    class="border-4" :style="{ borderColor: member.color }" />
                                <Avatar v-else :label="memberInitials(member)"
                                    :style="`background-color: ${member.color}`" class="font-semibold text-white"
                                    shape="circle" size="small" />
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getMemberImage } from "@/services/memberServices.js";
import Avatar from "primevue/avatar";

export default {
    inject: ['token'],
    components: { Avatar },
    props: {
        events: Array
    },
    data() {
        return {
            currentWeekStart: this.getMonday(new Date())
        };
    },
    computed: {
        week() {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(this.currentWeekStart);
                date.setDate(this.currentWeekStart.getDate() + i);
                const formattedDate = date.toISOString().split('T')[0];
                const dayEvents = this.events.filter(event =>
                    new Date(event.period.startDateTime).toISOString().split('T')[0] === formattedDate
                );
                week.push({
                    date,
                    id: formattedDate,
                    events: dayEvents
                });
            }
            return week;
        },
        formattedWeek() {
            const start = this.formatDate(this.currentWeekStart);
            const end = this.formatDate(new Date(this.currentWeekStart).setDate(this.currentWeekStart.getDate() + 6));
            return `${start} - ${end}`;
        },
        formattedYear() {
            return new Date(this.currentWeekStart).getFullYear();
        }
    },
    methods: {
        getMonday(d) {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(date.setDate(diff));
        },
        formatDate(date) {
            const locale = this.$i18n.locale;
            return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
        },
        previousWeek() {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(this.currentWeekStart.getDate() - 7);
            this.currentWeekStart = newDate; //
        },
        nextWeek() {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(this.currentWeekStart.getDate() + 7);
            this.currentWeekStart = newDate; //
        },
        getDayNumber(date) {
            return new Date(date).getDate();
        },
        getDayLetter(date) {
            const options = { weekday: 'short' };
            const locale = this.$i18n.locale;
            const dayName = new Intl.DateTimeFormat(locale, options).format(new Date(date));
            return dayName.charAt(0).toUpperCase();
        },
        memberInitials(member) {
            return member.name.charAt(0).toUpperCase();
        },
        async getMemberImages() {
            const getImagePromises = this.events.flatMap(event =>
                (event.members || []).map(async (member) => {
                    try {
                        const imageUrl = await getMemberImage(this.token, member.id);
                        member.imageUrl = imageUrl;
                    } catch (error) {
                        console.error(`Erreur lors du chargement de l'image pour le membre ${member.id}:`, error);
                    }
                })
            );
            await Promise.all(getImagePromises);
        },
    },
    mounted() {
        this.getMemberImages();
    }
};
</script>
