<template>

	<router-link :to="`/events/${event.id}/periods/${event.period.id}`">

		<div :style="eventBackgroundColorClass" class="flex flex-col gap-3 p-3 rounded hover:bg-slate-100">

			<div class="flex flex-col">
				<!-- Nom de l'événement -->
				<span class="text-xl">{{ event.name }}</span>

				<!-- Affichage de l'heure de début et de fin -->
				<span v-if="isAllDayEvent()">{{ $t('wholeDay') }}</span>
				<span v-else>{{ formatTime(event.period.startDateTime) }} - {{
						formatTime(event.period.endDateTime)
					}}</span>
			</div>

			<!-- Membres de l'événement -->
			<div class="flex gap-1">
				<div v-for="member in event.members" :key="member.id" class="flex items-center">
					<Avatar
						v-if="member.imageUrl"
						:image="member.imageUrl"
						shape="circle"
						size="small"
					/>
					<Avatar
						v-else
						:label="memberInitials(member)"
						:style="avatarColorClass"
						class="font-semibold"
						shape="circle"
						size="small"
					/>
				</div>
			</div>
		</div>
	</router-link>
</template>

<script>
import Avatar from "primevue/avatar";
import {getMemberImage} from "@/services/memberServices.js";

export default {
	name: 'ItemEvent',
	components: {
		Avatar
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
				try {
					member.imageUrl = await getMemberImage(this.token, member.id);
				} catch (error) {
					console.error(`Erreur lors du chargement de l'image pour le membre ${member.id}:`, error);
				}
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