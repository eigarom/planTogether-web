<template>
	<div
		:class="{'bg-surface-300': !isCurrentMonth,'bg-surface-50': isCurrentMonth && !isToday,'bg-surface-400':
		isToday}"
		class="flex flex-col gap-1 border py-1 sm:p-2 w-full overflow-y-auto">

		<p :class="{'text-grey-100': !isCurrentMonth}" class="text-xs pl-1">{{ dayNumber(day) }}</p>

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
		},
		currentMonth: {
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
		},
		isCurrentMonth() {
			return this.day.date.getMonth() === this.currentMonth.getMonth();
		}
	},
	methods: {
		dayNumber(day) {
			return day.date.getDate().toString().padStart(2, '0');
		},
	}
}
</script>