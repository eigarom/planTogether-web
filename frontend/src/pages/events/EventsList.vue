<template>
	<div>
		<div>
			<h2>Aujourd'hui</h2>
			<div v-for="event in sortedEventsByTime" :key="event.id"
				:style="{ backgroundColor: event.color, padding: '10px', borderRadius: '5px', marginBottom: '10px' }">
				<h3>{{ event.name }}</h3>
				<div v-for="period in event.periods" :key="period.id">
					Début : {{ formatTime(period.startDateTime) }} - Fin : {{ formatTime(period.endDateTime) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { fetchEventsList } from '../../services/eventServices';

export default {
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
		formatTime(dateTime) {
			const date = new Date(dateTime);
			const time = date.toISOString().split('T')[1].substring(0, 5);
			return time;
		}
	},
	computed: {
		visibleEvents() {
			
			return this.eventsList.filter(event => {
				console.log(this.user);
				const isParticipant = event.members && event.members.some(member => member.id === this.user.id);
				return event.isVisible || isParticipant;
				
			});
		},
		filteredEvents() {
			const today = new Date().setHours(0, 0, 0, 0);

			return this.visibleEvents.filter(event =>
				event.periods.some(period => {
					const startTime = new Date(period.startDateTime).setHours(0, 0, 0, 0);
					const endTime = new Date(period.endDateTime).setHours(0, 0, 0, 0);
					return (startTime <= today && endTime >= today);
				})
			);
		},
		sortedEventsByTime() {
			return this.filteredEvents.slice().sort((a, b) => {
				return new Date(a.periods[0].startDateTime) - new Date(b.periods[0].startDateTime);
			});
		}
	},
	mounted() {
		this.getEventsWithToken();
		this.getCurrentDate();
	}
}
</script>

<style scoped></style>
