<template>
	<div class="flex flex-col gap-1 w-full h-full">
		<!-- Entête -->
		<div class="flex flex-col">

			<div class="inline-flex justify-between">
				<!-- Navigation -->
				<div class="inline-flex items-center gap-5">
					<!-- Bouton aujourd'hui -->
					<Button :label="$t('today')" class="custom-button-today" severity="info" @click="thisDay"/>

					<!-- Boutons semaines précédente / suivante -->
					<div class="inline-flex">
						<Button class="custom-button-left" icon="pi pi-chevron-left" severity="info"
								@click="previousWeek"/>
						<Button class="custom-button-right" icon="pi pi-chevron-right" severity="info"
								@click="nextWeek"/>
					</div>

					<!-- Mois -->
					<div class="inline-flex items-center gap-2">
						<h2 class="font-semibold">{{ formattedMonth }}</h2>

						<i class="pi pi-angle-down" @click="toggle"/>

						<Popover ref="op">
							<DatePicker v-model="selectedDate" class="custom-datepicker" inline
										@update:modelValue="selectDay"/>
						</Popover>
					</div>
				</div>

				<!-- Ajouter un événement -->
				<Button as="router-link" class="custom-add-button" icon="pi pi-calendar-plus" severity="info"
						to="/events/add"/>
			</div>
		</div>

		<!-- Dates du jour -->
		<div class="grid grid-cols-7 w-full">
			<p v-for="day in week" :key="day.id" class="text-xl pl-2">
				{{ dayNumber(day) }}
			</p>

			<p v-for="i in 7" :key="i" class="text-xs pl-2">
				{{ getDay(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + (i - 1))) }}
			</p>
		</div>

		<!-- Événements -->
		<div class="overflow-auto h-full border bg-surface-100">
			<div class="grid grid-cols-7 w-full h-full">
				<DailyEvents
					v-for="day in week"
					:key="day.id"
					:day="day"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Avatar from "primevue/avatar";
import DailyEvents from "./DailyEvents.vue";
import Button from "primevue/button";
import DatePicker from 'primevue/datepicker';
import Popover from 'primevue/popover';


export default {
	components: {Avatar, DailyEvents, Button, DatePicker, Popover},
	props: {
		dates: Array
	},
	data() {
		return {
			currentWeekStart: this.getMonday(new Date()),
			selectedDate: new Date()
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
		formattedMonth() {
			const start = this.formatDate(this.currentWeekStart);
			const end = this.formatDate(new Date(this.currentWeekStart).setDate(this.currentWeekStart.getDate() + 6));


			if (start === end) {
				return `${start}`;
			} else {
				return `${start} - ${end}`;
			}
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
			return new Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric'}).format(date);
		},
		previousWeek() {
			const newDate = new Date(this.currentWeekStart);
			newDate.setDate(this.currentWeekStart.getDate() - 7);
			this.currentWeekStart = newDate;
		},
		nextWeek() {
			const newDate = new Date(this.currentWeekStart);
			newDate.setDate(this.currentWeekStart.getDate() + 7);
			this.currentWeekStart = newDate;
		},
		thisDay() {
			const today = new Date();
			this.currentWeekStart = this.getMonday(today);
		},
		dayNumber(day) {
			return day.date.getDate().toString().padStart(2, '0');
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
			this.currentWeekStart = this.getMonday(this.selectedDate);
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

.custom-add-button {
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