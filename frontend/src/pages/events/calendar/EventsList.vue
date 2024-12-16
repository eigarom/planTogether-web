<template>
	<div class="flex flex-col gap-3 w-full">
		<h1 class="text-2xl">{{ $t('eventsTitle') }}</h1>

		<!-- Calendrier -->
		<div v-if="!loading" class="flex bg-white border p-5 rounded-lg h-[calc(100vh-192px)]">
			<WeeklyEvents :dates="dates"/>
		</div>
	</div>
</template>

<script>
import WeeklyEvents from './WeeklyEvents.vue';
import {getEventsList} from '@/services/eventServices.js';

export default {
	components: {
		WeeklyEvents
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
							description: event.description,
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
