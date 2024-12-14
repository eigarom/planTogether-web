<template>
	<div class="border p-2 w-full h-auto">
		<h3 class="flex justify-center">{{ dayNumber }}</h3>

		<div class="flex flex-col gap-2">
			<ItemEvent
				v-for="event in day.events"
				:key="event.id"
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
			console.log(this.day)
			return this.day.date.getDate()
		}
	}
}
</script>