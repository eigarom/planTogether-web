<template>
	<div class="flex flex-col w-full sm:bg-white sm:border sm:p-5 rounded-lg h-[calc(100vh-192px)]">
		<!-- Entête -->
		<div class="flex flex-col bg-white border sm:border-0 rounded-t-lg">

			<div class="inline-flex justify-between items-start p-3 sm:p-0">
				<!-- Navigation -->
				<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 sm:mb-2">

					<!-- Boutons navigation -->
					<div class="inline-flex items-center gap-5">
						<!-- Bouton aujourd'hui -->
						<Button :label="$t('today')" class="custom-button-today" severity="info" @click="thisDay"/>

						<!-- Boutons semaines précédente / suivante -->
						<div class="inline-flex">
							<Button class="custom-button-left" icon="pi pi-chevron-left" severity="info"
									@click="previousMonth"/>
							<Button class="custom-button-right" icon="pi pi-chevron-right" severity="info"
									@click="nextWeek"/>
						</div>
					</div>

					<!-- Mois -->
					<div class="inline-flex items-center gap-2">
						<h2 class="font-semibold">{{ getCurrentMonthAndYear }}</h2>

						<i class="pi pi-angle-down" @click="toggle"/>

						<Popover ref="op">
							<DatePicker v-model="selectedDate" class="custom-datepicker" inline
										@update:modelValue="selectDay"/>
						</Popover>
					</div>
				</div>

				<div class="inline-flex items-center gap-5">
					<!-- Modifier vue -->
					<Button
						class="custom-button"
						icon="pi pi-calendar"
						severity="info"
						@click="$emit('switchCalendarType', 'weekly')"
					/>

					<!-- Ajouter un événement -->
					<Button
						as="router-link"
						class="custom-button"
						icon="pi pi-calendar-plus"
						severity="info"
						to="/events/add"
					/>
				</div>
			</div>

			<!-- Noms du jour -->
			<div class="grid grid-cols-7 w-full pb-1">
				<p v-for="(day, index) in getWeekDays()" :key="index" class="text-xs pl-2">
					<span class="hidden sm:inline">{{ day }}</span>
					<span class="inline sm:hidden">{{ day.slice(0, 3) }}</span>
				</p>
			</div>
		</div>

		<!-- Événements -->
		<div class="h-full border overflow-hidden">
			<div :class="month.length > 35 ? 'grid-rows-6' : 'grid-rows-5'" class="grid grid-cols-7 w-full h-full">
				<MonthlyDailyEvents
					v-for="day in month"
					:key="day.id"
					:currentMonth="currentMonth"
					:day="day"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Button from "primevue/button";
import DatePicker from 'primevue/datepicker';
import Popover from 'primevue/popover';
import MonthlyDailyEvents from "@/pages/events/calendar/MonthlyDailyEvents.vue";

export default {
	components: {MonthlyDailyEvents, Button, DatePicker, Popover},
	props: {
		dates: Array
	},
	data() {
		return {
			currentMonth: new Date(),
			selectedDate: new Date()
		};
	},
	computed: {
		month() {
			const month = [];
			const firstDay = this.getCalendarFirstDay(this.currentMonth);
			const lastDay = this.getCalendarLastDay(this.currentMonth);

			for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
				const formattedDate = date.toLocaleDateString('fr-CA');
				const day = this.dates.find(d => d.id === formattedDate) || {id: formattedDate, events: []};

				month.push({
					date: new Date(date),
					id: formattedDate,
					events: day.events
				});
			}
			return month;
		},
		getCurrentMonthAndYear() {
			const locale = this.$i18n.locale;
			return new Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric'}).format(new Date);
		},
	},
	methods: {
		getMonthFirstDay(d) {
			const date = new Date(d);
			date.setDate(1);
			return date;
		},
		getCalendarFirstDay(d) {
			const date = new Date(d);
			date.setDate(1); // Premier jour du mois
			const day = date.getDay();
			const diff = day === 0 ? -6 : 1 - day; // Ajuster pour obtenir le lundi précédent
			return new Date(date.setDate(date.getDate() + diff));
		},
		getCalendarLastDay(d) {
			const date = new Date(d);
			const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Dernier jour du mois
			const day = lastDay.getDay();
			const diff = day === 0 ? 0 : 8 - day; // Ajuster pour obtenir le dimanche suivant
			return new Date(lastDay.setDate(lastDay.getDate() + diff));
		},
		getWeekDays() {
			const days = [];
			const startDate = new Date(this.currentMonth);
			startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));
			for (let i = 0; i < 7; i++) {
				const date = new Date(startDate);
				date.setDate(startDate.getDate() + i);
				days.push(this.getDay(date));
			}
			return days;
		},
		previousMonth() {
			const newDate = new Date(this.currentMonth);
			newDate.setMonth(this.currentMonth.getMonth() - 1);
			this.currentMonth = newDate;
		},
		nextWeek() {
			const newDate = new Date(this.currentMonth);
			newDate.setMonth(this.currentMonth.getMonth() + 1);
			this.currentMonth = newDate;
		},
		thisDay() {
			const today = new Date();
			this.currentMonth = this.getMonthFirstDay(today);
		},
		getDay(date) {
			const options = {weekday: 'long'};
			const locale = this.$i18n.locale;
			const dayName = new Intl.DateTimeFormat(locale, options).format(new Date(date));
			return dayName.charAt(0).toUpperCase() + dayName.slice(1);
		},
		toggle(event) {
			this.$refs.op.toggle(event);
		},
		selectDay() {
			this.currentMonth = this.getMonthFirstDay(this.selectedDate);
			this.$refs.op.hide();
		}
	}
};
</script>

<style scoped>
.custom-button-left {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	width: 30px;
	height: 30px;
}

.custom-button-right {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	width: 30px;
	height: 30px;
}

.custom-button {
	width: 30px;
	height: 30px;
}

.custom-button-today {
	height: 30px;
}

.custom-datepicker {
	--p-datepicker-panel-border-color: white;
}
</style>