<template>
	<div class="flex flex-col gap-5 w-full">
		<!-- Entête -->
		<div class="flex justify-between">
			<h1 class="text-3xl">{{ $t('eventsTitle') }}</h1>

			<Button as="router-link" class="w-48" icon="pi pi-calendar-plus" to="/events/add"/>
		</div>

		<!-- Calendrier -->
		<div v-if="!loading">
			<WeeklyEvents :dates="dates"/>
		</div>
	</div>
</template>

<script>
import Button from 'primevue/button';
import WeeklyEvents from './WeeklyEvents.vue';
import {getEventsList} from '@/services/eventServices.js';

export default {
	components: {
		WeeklyEvents, Button
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
					const endDateTimeEndOfDay = new Date(new Date(period.endDateTime).setHours(23, 59, 59, 999));

					for (
						let dt = new Date(period.startDateTime);
						// Vérifie si la date courante (dt) est avant ou égale à la fin de la journée du endDateTime
						dt < endDateTimeEndOfDay;
						dt.setDate(dt.getDate() + 1)
					) {
						// Format de la date locale en "YYYY-MM-DD"
						const dayId = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

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
				});
			});
			this.loading = false;
		}
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
