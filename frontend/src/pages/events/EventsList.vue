<template>
	<div class="top-20 w-96 gap-3 flex flex-col pt-20 pb-16">
		<h1 class="text-3xl mb-4 text-center">{{ $t('eventsTitle') }}</h1>
		<Button as="router-link" :label="$t('buttonCreateEvent')" to="/events/add" />
		<div v-if="!loading" class="flex flex-col border p-3 rounded-lg gap-3">
			<DailyEvents v-for="date in dates" :key="date.id" :id="date.id" :events="date.events" />
		</div>
	</div>

</template>

<script>
import Button from 'primevue/button';
import DailyEvents from './DailyEvents.vue';
import { getEventsList } from '../../services/eventServices';

export default {
	components: {
		DailyEvents, Button
	},
	inject: ['user'],
	data() {
		return {
			eventsList: [],
			dates: [],
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
			this.generateDates();
		},
		generateDates() {
			this.visibleEvents.forEach(event => {
				event.periods.forEach(period => {
					// Initialiser une boucle qui parcourt chaque jour dans l'intervalle de la période
					for (let dt = new Date(period.startDateTime); dt <= new Date(period.endDateTime); dt.setDate(dt.getDate() + 1)) {
						const dayId = dt.toISOString().split('T')[0]; // Format de la date en "YYYY-MM-DD"

						// Vérifier si un objet `date` avec cet `id` existe déjà
						let dateObj = this.dates.find(date => date.id === dayId);

						if (!dateObj) {
							// Si l'objet `date` n'existe pas, le créer avec cet `id` et un tableau `events` vide
							dateObj = {
								id: dayId,
								events: []
							};
							this.dates.push(dateObj);
						}

						// Ajouter `newEvent` à `events` dans `dateObj`
						dateObj.events.push({
							id: event.id,
							name: event.name,
							period, // Ajout de la période entière ici
							members: event.members
						});
					}
				})
			})
			this.loading = false;
		},
	},
	computed: {
		visibleEvents() {
			return this.eventsList.filter(event => {
				const isParticipant = event.members && event.members.some(member => member.id === this.user.id);
				return event.isVisible || isParticipant;
			});
		},
	},
	mounted() {
		this.getEventsWithToken();
	}
};
</script>
