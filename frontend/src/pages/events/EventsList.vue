<template>
	<div>
		<p>Hello {{ this.user.name }} !!!! </p>

		<h2>Liste des événements</h2>
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
		}
	},
	mounted() {
		this.getEventsWithToken();
	}
}
</script>

<style scoped></style>
