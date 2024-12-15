<template>

	<!-- Affichage de l'événement -->
	<div :style="eventBackgroundColorClass" class="flex flex-col gap-3 p-3 rounded hover:bg-slate-100 cursor-pointer"
		 @click="showDialog = true">

		<div class="flex flex-col">
			<!-- Nom de l'événement -->
			<p class="truncate">{{ event.name }}</p>

			<!-- Affichage de l'heure de début et de fin -->
			<p class="text-xs truncate">{{ getEventTime() }}</p>
		</div>

		<!-- Membres de l'événement -->
		<div class="flex justify-left">
			<AvatarGroup>
				<Avatar
					v-for="member in event.members"
					:key="member.id"
					:image="member.imageUrl"
					:label="!member.imageUrl ? memberInitials(member) : null"
					:style="!member.imageUrl ? avatarColorClass : null"
					shape="circle"
					size="small"
				/>
			</AvatarGroup>
		</div>
	</div>

	<!-- Dialog pour afficher les détails de l'événement -->
	<Dialog v-model:visible="showDialog" :header="$t('eventsTitle')" modal>
		<div class="flex flex-col gap-4 w-96">

			<!-- Nom et horaires de l'événement -->
			<div class="flex flex-col">
				<p class="text-xl font-semibold">{{ event.name }}</p>

				<!-- Dates de l'événement -->
				<div>
					<!-- Événement dure toute la journée -->
					<p v-if="isAllday()">{{ formatDate(event.period.startDateTime) }} - {{ $t('wholeDay') }}</p>

					<!-- Événement dans la journée -->
					<p v-else-if="formatDate(event.period.startDateTime) === formatDate(event.period.endDateTime)">
						{{ formatDate(event.period.startDateTime) }} - {{ formatTime(event.period.startDateTime) }}
						: {{ formatTime(event.period.endDateTime) }}
					</p>

					<!-- Événement sur plusieurs jours -->
					<div v-else class="flex flex-col justify-left">
						<p>{{ formatDate(event.period.startDateTime) }} - {{ formatTime(event.period.startDateTime) }}
							-</p>
						<p>{{ formatDate(event.period.endDateTime) }} - {{ formatTime(event.period.endDateTime) }}</p>
					</div>
				</div>
			</div>

			<div v-if="event.description" class="overflow-auto max-h-40">
				<p>{{ event.description }}</p>
			</div>

			<div class="inline-flex items-center gap-3">
				<i class="pi pi-users" style="font-size: 1.5rem"></i>
				<AvatarGroup>
					<Avatar
						v-for="member in event.members"
						:key="member.id"
						:image="member.imageUrl"
						:label="!member.imageUrl ? memberInitials(member) : null"
						:style="!member.imageUrl ? `background-color: ${member.color}` : ''"
						class="font-semibold text-white flex-shrink-0"
						shape="circle"
						size="small"
					/>
				</AvatarGroup>
			</div>

			<div class="flex justify-center gap-2 mt-4">
				<Button :to="`/events/${event.id}/periods/${event.period.id}`" as="router-link" class="w-40"
						label="Modifier"/>
			</div>
		</div>
	</Dialog>
</template>

<script>
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
	name: 'ItemEvent',
	components: {
		Dialog, Button, Avatar, AvatarGroup
	},
	inject: ['token', 'family'],
	props: {
		event: {
			type: Object,
			required: true
		},
		day: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showDialog: false
		};
	},
	methods: {
		memberInitials(member) {
			return member.name.split(' ').map(name => name[0]).join('');
		},
		async getMemberImages() {
			for (const member of this.event.members) {
				if (this.family.guestMembers.find(m => m.id === member.id))
					member.imageUrl = this.family.guestMembers.find(m => m.id === member.id).imageUrl;
				else
					member.imageUrl = this.family.accountMembers.find(m => m.id === member.id).imageUrl;
			}
		},
		getEventTime() {
			const startEvent = new Date(this.event.period.startDateTime);
			const endEvent = new Date(this.event.period.endDateTime);
			const startDay = new Date(new Date(this.day.date).setHours(0, 0, 0, 0));
			const endDay = new Date(new Date(this.day.date).setHours(23, 59, 0, 0));

			// Si l'événement commence et se termine le même jour
			if (startDay >= startEvent && endDay <= endEvent) {
				return this.$t('wholeDay');
			}
			// Si l'événement se termine un autre jour afficher heure de fin à 23h59
			if (endDay < endEvent) {
				return `${this.formatTime(startEvent)} - 23:59`;
			}

			// Si l'événement commence un autre jour afficher heure de début à 00h00
			if (startDay > startEvent) {
				return `00:00 - ${this.formatTime(endEvent)}`;
			}

			// Si l'événement commence et se termine le même jour
			return `${this.formatTime(startEvent)} - ${this.formatTime(endEvent)}`;
		},
		formatTime(dateTime) {
			const date = new Date(dateTime);
			return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
		}, formatDate(dateTime) {
			const locale = this.$i18n.locale;
			const date = new Date(dateTime);
			return new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'long', day: 'numeric'}).format(date);
		},
		isAllday() {
			const startEvent = new Date(this.event.period.startDateTime);
			const endEvent = new Date(this.event.period.endDateTime);
			const startDay = new Date(new Date(this.day.date).setHours(0, 0, 0, 0));
			const endDay = new Date(new Date(this.day.date).setHours(23, 59, 0, 0));

			return startDay >= startEvent && endDay <= endEvent;
		}
	},
	computed: {
		eventBackgroundColorClass() {
			if (this.event.members.length > 1) {
				return {backgroundColor: this.family.color};
			}
			return {backgroundColor: this.event.members[0].color};
		},
		avatarColorClass() {
			if (this.event.members.length > 1) {
				return {
					backgroundColor: this.event.members[0].color,
					color: 'white'
				};
			}
			return {
				backgroundColor: 'white',
				color: this.event.members[0].color
			};
		},
	},
	mounted() {
		this.getMemberImages();
	}
}
</script>