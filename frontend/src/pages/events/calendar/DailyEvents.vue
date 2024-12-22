<template>
	<div :class="isToday ?'bg-surface-400': 'bg-surface-100'"
		 class="flex flex-col gap-2 border py-2 sm:p-2 w-full pb-7">
		<ItemEvent
			v-for="event in sortedEvents"
			:key="event.id"
			:day="day"
			:event="event"
		/>
	</div>
</template>

<script>
import ItemEvent from './ItemEvent.vue'

export default {
	name: 'DailyEvents',
	components: {
		ItemEvent
	},
	props: {
		day: {
			type: Object,
			required: true
		}
	},
	computed: {
		sortedEvents() {
			return this.day.events.slice().sort((a, b) => {
				return new Date(a.period.startDateTime) - new Date(b.period.startDateTime);
			});
		},
		isToday() {
			const today = new Date();
			const dayDate = new Date(this.day.date);

			return (
				today.getFullYear() === dayDate.getFullYear() &&
				today.getMonth() === dayDate.getMonth() &&
				today.getDate() === dayDate.getDate()
			);
		}
	}
}
</script>