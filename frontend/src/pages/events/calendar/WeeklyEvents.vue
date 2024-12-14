<template>
	<!--	<div class="flex flex-col bg-white border p-3 rounded-lg gap-3 min-h-[calc(100vh-227px)] w-full">-->
	<div class="flex flex-col bg-white border p-3 rounded-lg gap-3   w-full">

		<!-- Année -->
		<div class="flex justify-center items-center text-xl font-bold">
			{{ formattedYear }}
		</div>

		<!-- Navigation -->
		<div class="flex justify-between items-center mb-4">
			<button @click="previousWeek">← {{ $t('previousWeek') }}</button>
			<h2>{{ formattedWeek }}</h2>
			<button @click="nextWeek">→ {{ $t('nextWeek') }}</button>
		</div>

		<!-- Dates du jour -->
		<!--			<div v-for="i in 7" :key="i" class="border text-center font-bold h-20 bg-blue-100">-->
		<!--				{{ getDayLetter(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + (i - 1))) }}-->
		<!--			</div>-->

		<!-- Événements de la semaine -->
		<div class="grid grid-cols-7 gap-2 w-full h-full">
			<DailyEvents
				v-for="day in week"
				:key="day.id"
				:day="day"
			/>
		</div>
	</div>
</template>

<script>
import Avatar from "primevue/avatar";
import DailyEvents from "./DailyEvents.vue";

export default {
	components: {Avatar, DailyEvents},
	props: {
		dates: Array
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

				const formattedDate = date.toLocaleDateString('fr-CA');

				const day = this.dates.find(d => d.id === formattedDate) || {id: formattedDate, events: []};

				week.push({
					date,
					id: formattedDate,
					events: day.events
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
			return new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long'}).format(date);
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
		}
	}
};
</script>
