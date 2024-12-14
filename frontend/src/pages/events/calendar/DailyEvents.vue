<template>
	<div class="border rounded p-2 w-full ">
		<h3 class="flex justify-center">{{ dayNumber }}</h3>

		<div class="flex flex-col gap-2">
			<ItemEvent
				v-for="event in sortedEvents"
				:key="event.id"
				:day="day"
				:event="event"
			/>
		</div>
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
		dayNumber() {
			return this.day.date.getDate()
		},
		sortedEvents() {
			return this.day.events.slice().sort((a, b) => {
				return new Date(a.period.startDateTime) - new Date(b.period.startDateTime);
			});
		}
	}
}
</script>