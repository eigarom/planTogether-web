<template>
	<Menu id="sidebar" :model="items" class="fixed left-5 z-40 p-4 h-[calc(100%-148px)] w-52">
		<template #start>
			<div class="flex flex-col gap-4 p-1">
				<!--Informations de l'utilisateur-->
				<router-link
					class="inline-flex items-center gap-2 hover:bg-slate-100 rounded p-1"
					to="/profile">
					<Avatar
						:image="user.imageUrl"
						:label="!user.imageUrl ? userInitial : null"
						:style="!user.imageUrl ? `background-color: ${user.color}` : null"
						class="font-semibold text-white flex-shrink-0"
						shape="circle"
						size="small"
					/>

					<div class="flex flex-col justify-between w-[117px]">
						<p class="text-nowrap overflow-hidden">{{ user.name }}</p>
						<p class="text-xs">{{ family.name }}</p>
					</div>
				</router-link>

				<!--Image de la famille-->
				<div v-if="family.imageUrl" class="flex flex-col items-cente pb-1">
					<Image :src="family.imageUrl" alt="Image famille" image-class="rounded-xl"/>
				</div>
			</div>
		</template>

		<template #item="{ item, props }">
			<router-link v-slot="{ href, navigate }" :to="item.route" custom>
				<a :href="href" v-bind="props.action" @click="navigate">
					<span :class="item.icon"/>
					<span class="ml-2">{{ item.label }}</span>
				</a>
			</router-link>
		</template>
	</Menu>
</template>

<script>
import Menu from 'primevue/menu';
import Image from "primevue/image";
import Avatar from "primevue/avatar";

export default {
	components: {
		Menu, Image, Avatar
	},
	inject: ['token', 'user', 'family'],
	data() {
		return {};
	},
	computed: {
		userInitial() {
			return this.user.name.charAt(0).toUpperCase();
		},
		items() {
			return [
				{label: this.$t('calendarMenu'), icon: 'pi pi-calendar', route: '/events'},
				{label: this.$t('familyMenu'), icon: 'pi pi-users', route: '/my-family'},
			];
		}
	}
}
</script>