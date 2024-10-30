<template>
	<h1>Événements</h1>
	<div v-if="!loading">
		<div v-for="(events, date) in sortedEventsByTime" :key="date">
			<h2> {{ formatPrettyDate(date) }} </h2>
			<div>
				<DailyEvents v-for="event in events" :key="event.id" :id="event.id" :name="event.name" :periods="event.periods" />
			</div>
		</div>
	</div>
</template>

<script>
import DailyEvents from './DailyEvents.vue'
import { getEventsList } from '../../services/eventServices';

export default {
	components: {
		DailyEvents
	},
	inject: ['user'],
	data() {
		return {
			eventsList: [],
			currentDate: "",
			loading: true
		};
	},
	methods: {
		async getEventsWithToken() {
			const token = this.$cookies.get('jwtToken');
			if (token) {
				try {
					this.eventsList = await getEventsList(token);
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
			this.loading = false;
		},
		formatPrettyDate(dateString) {
			const parts = dateString.split('/');
			if (parts.length !== 3) {
				console.warn(`Date invalide: ${dateString}`);
				return 'Date invalide';
			}

			const formattedDateString = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
			const date = new Date(formattedDateString);

			if (isNaN(date)) {
				console.warn(`Date invalide: ${formattedDateString}`);
				return 'Date invalide';
			}

			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return date.toLocaleDateString('fr-FR', options);
		}
	},
	computed: {
		visibleEvents() {
			return this.eventsList.filter(event => {
				const isParticipant = event.members && event.members.some(member => member.id === this.user.id);
				return event.isVisible || isParticipant;
			});
		},
		groupedEventsByDate() {
			const eventsByDate = {};

			this.visibleEvents.forEach(event => {
				event.periods.forEach(period => {
					const date = new Date(period.startDateTime).toLocaleDateString();

					if (!eventsByDate[date]) {
						eventsByDate[date] = [];
					}

					eventsByDate[date].push(event);
				});
			});

			return eventsByDate;
		},
		sortedEventsByTime() {
			const uniqueEvents = new Map();

			this.visibleEvents.forEach(event => {
				event.periods.forEach(period => {
					const periodKey = `${event.id}-${period.startDateTime}-${period.endDateTime}`;
					if (!uniqueEvents.has(periodKey)) {
						uniqueEvents.set(periodKey, { ...event, periods: [period] });
					}
				});
			});

			const sortedEvents = {};

			uniqueEvents.forEach((event) => {
				const date = new Date(event.periods[0].startDateTime).toLocaleDateString("fr-FR");

				if (!sortedEvents[date]) {
					sortedEvents[date] = [];
				}
				sortedEvents[date].push(event);
			});

			return sortedEvents;
		}
	},
	mounted() {
		this.getEventsWithToken();
	}
};
</script>
