<template>

	<router-link :to="`/events/${event.id}/periods/${event.period.id}`">

		<div :style="eventBackgroundColorClass" class="flex flex-col gap-3 p-3 rounded hover:bg-slate-100">

			<div class="flex flex-col">
				<!-- Nom de l'événement -->
				<p class="truncate">{{ event.name }}</p>

				<!-- Affichage de l'heure de début et de fin -->
				<p class="text-xs truncate">{{ getEventTime() }}</p>
			</div>

			<!-- Membres de l'événement -->
			<div class="card flex justify-left">
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
	</router-link>
</template>

<script>
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";

export default {
	name: 'ItemEvent',
	components: {
		Avatar, AvatarGroup
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
		},
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