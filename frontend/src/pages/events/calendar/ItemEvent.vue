<template>

	<router-link :to="`/events/${event.id}/periods/${event.period.id}`">

		<div :style="eventBackgroundColorClass" class="flex flex-col gap-3 p-3 rounded hover:bg-slate-100">

			<div class="flex flex-col">
				<!-- Nom de l'événement -->
				<p class="text-xl truncate">{{ event.name }}</p>

				<!-- Affichage de l'heure de début et de fin -->
				<p v-if="isAllDayEvent()" class="truncate">{{ $t('wholeDay') }}</p>
				<p v-else class="truncate">{{ formatTime(event.period.startDateTime) }} - {{
						formatTime(event.period.endDateTime)
					}}</p>
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
		isAllDayEvent() {
			const start = new Date(this.event.period.startDateTime);
			const end = new Date(this.event.period.endDateTime);
			return start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 23 &&
				end.getMinutes() === 59;
		},
		formatTime(dateTime) {
			const date = new Date(dateTime);
			return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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