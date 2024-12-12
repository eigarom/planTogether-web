<template>
	<Menu id="sidebar" :model="items" class="fixed left-8 z-40 p-4 h-[calc(100%-165px)] w-60">
		<template #start>
			<div class="flex flex-col gap-5 p-1">
				<!--Informations de l'utilisateur-->
				<div class="inline-flex items-center justify-between">
					<router-link class="inline-flex items-center gap-3 " to="/profile">
						<Avatar v-if="user.imageUrl" :image="user.imageUrl" shape="circle" size="small"/>
						<Avatar v-else :label="userInitial" :style="`background-color: ${user.color}`"
								class="font-semibold text-white" shape="circle" size="small"/>
						<span class=" text-xl">{{ user.name }}</span>
					</router-link>
					<span class="pi pi-sign-out" @click="logout"></span>
				</div>

				<!--Image de la famille-->
				<div v-if="family.imageUrl" class="flex flex-col items-cente pb-4">
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
	inject: ['token', 'user', 'family', 'logout'],
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