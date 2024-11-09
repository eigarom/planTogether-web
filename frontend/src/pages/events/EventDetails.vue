<template>
	<div v-if="event">
		<div :style="{ fontSize: '24px' }"> {{ event.name }}</div>
		<div>{{ $t('description') }} : {{ event.description }}</div>
		<div>{{ $t('visibility') }} : {{ formatIsVisible(event.isVisible) }}</div>
		<br />
		<hr />
		<div>
			<h3>{{ $t('periods') }} :</h3>
			<ul>
				<li v-for="(period, index) in event.periods" :key="index">
					{{ $t('startDate') }} : {{ formatDate(period.startDateTime) }} - {{ $t('endDate') }} : {{
						formatDate(period.endDateTime)
					}}
					<div>
						<h3>{{ $t('alerts') }} :</h3>
						<ul v-if="period.alerts && period.alerts.length > 0">
							<li v-for="(alert, alertIndex) in period.alerts" :key="alertIndex">
								{{ $t('alertDate') }}: {{ alert.dateTime }}
							</li>
						</ul>
						<p v-else>{{ $t('noAlerts') }}</p>
					</div>
				</li>
			</ul>
		</div>
		<br />
		<hr />

		<br />
		<hr />
		<div>
			<h3>{{ $t('participants') }}:</h3>
			<ul>
				<li v-for="(member, index) in event.members" :key="index">
					{{ member.name }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { getEvent } from '@/services/eventServices.js';

export default {
	props: {
		id: String
	},
	data() {
		return {
			idEvent: this.id,
			event: {},
			loading: true
		}
	},
	methods: {
		async getEventWithToken(id) {
			const token = this.$cookies.get('jwtToken');
			if (token) {
				try {
					this.event = await getEvent(token, id);
					console.log("Event data:", this.event);
				} catch (error) {
					this.event = null;
					console.error('Erreur:', error);
				}
			}
			this.loading = false;
		},
		formatDate(dateString) {
			const [datePart, timePart] = dateString.split('T');
			const time = timePart.substring(0, 5);
			return `${datePart} ${time}`;
		},
		formatIsVisible(isVisible) {
			if (isVisible) {
				return this.$t('public');
			} else {
				return this.$t('private');
			}
		}
	},
	mounted() {
		this.getEventWithToken(this.id);
	}

}

</script>