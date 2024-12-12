<template>
	<div>
		<div class="flex justify-between items-center mb-4">
			<button @click="previousWeek">← {{ $t('previousWeek') }}</button>
			<h2>{{ formattedWeek }}</h2>
			<button @click="nextWeek">→ {{ $t('nextWeek') }}</button>
		</div>
		<div class="grid grid-cols-7 gap-2 border">
			<div v-for="day in week" :key="day.id" class="border p-2">
				<h3>{{ formatDate(day.date) }}</h3>
				<div v-for="event in day.events" :key="event.id" class="bg-blue-100 p-1 rounded">
					<router-link :to="`/events/${event.id}/periods/${event.period.id}`">
						{{ event.name }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
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
			return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
		},
		previousWeek() {
			this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
		},
		nextWeek() {
			this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
		}
	}
};
</script>
