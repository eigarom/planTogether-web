<template>
	<div>
		<p>Hello {{ this.user.name }} !!!! </p>
		<div>
			<h2>Événements du jour</h2>
			<ul>
				<li v-for="event in filteredEvents" :key="event.id">
					{{ event.name }} <!-- Ou toute autre information pertinente -->
				</li>
			</ul>
		</div>
		<h2>Liste des événements</h2>
		{{ currentDate }}
		<EventItem v-for="event in eventsList" :key="event.id" :id="event.id" :name="event.name"
			:description="event.description" :color="event.color" :isVisible="event.isVisible" :periods="event.periods"
			:alerts="event.alerts" />
	</div>
</template>

<script>
import EventItem from './EventItem.vue';
import { fetchEventsList } from '../../services/eventServices';

export default {
	components: {
		EventItem
	},
	inject: ['user'],
	data() {
		return {
			eventsList: [],
			dailyEvents: [],
			currentDate: "",
			loading: true
		}
	},
	methods: {
		async getEventsWithToken() {
			const token = this.$cookies.get('jwtToken');
			if (token) {
				try {
					this.eventsList = await fetchEventsList(token);
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
			this.loading = false;
		},
		async getCurrentDate() {
			const today = new Date();
			const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			//const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			//const dateTime = date + ' ' + time;
			this.currentDate = date;
		},
	},
	computed: {
		filteredEvents() {
			const today = new Date().setHours(0, 0, 0, 0);

			return this.eventsList.filter(event =>
				event.periods.some(period => {
					const startTime = new Date(period.startDateTime).setHours(0, 0, 0, 0);
					const endTime = new Date(period.endDateTime).setHours(0, 0, 0, 0);
					return (startTime <= today && endTime >= today);
				})
			);
		}
	},
	mounted() {
		this.getEventsWithToken();
		this.getCurrentDate();
	}
}
</script>

<style scoped></style>
