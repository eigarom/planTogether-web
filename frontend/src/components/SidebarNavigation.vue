<template>
	<Menu v-if="!isLoading" id="sidebar" :model="items" class="p-1 border-0 h-fit">
		<template #start>
			<div class="flex flex-col items-center py-2">
				<span class="text-xl font-semibold">PLAN<span class="text-blue-300">TOGETHER</span></span>
				<Image v-if="familyImageUrl" :src="familyImageUrl" alt="Image famille"
					   image-class="rounded-xl"
					   width="170"/>
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

		<template #end>
			<router-link class="inline-flex items-center px-3 py-2 justify-between w-full" to="/profile">
				<div class="inline-flex items-center gap-3">
					<Avatar v-if="user.imageUrl" :image="user.imageUrl"
							shape="circle" size="small"/>
					<Avatar v-else :label="userInitial" :style="`background-color: ${user.color}`"
							class="font-semibold text-white" shape="circle" size="small"/>
					<span class="font-black">{{ user.name }}</span>
				</div>
				<span class="pi pi-sign-out" @click="logout"></span>
			</router-link>
		</template>
	</Menu>
</template>

<script>
import Menu from 'primevue/menu';
import Image from "primevue/image";
import Avatar from "primevue/avatar";
import {getFamilyImage} from "@/services/familyServices.js";

export default {
	components: {
		Menu, Image, Avatar
	},
	inject: ['token', 'user', 'logout'],
	data() {
		return {
			items: [
				{separator: true},
				{label: 'Calendrier', icon: 'pi pi-calendar', route: '/events'},
				{separator: true}
			],
			familyImageUrl: '',
			isLoading: true
		};
	},
	computed: {
		userInitial() {
			return this.user.name.charAt(0).toUpperCase();
		}
	},
	async created() {
		this.familyImageUrl = await getFamilyImage(this.token);
		this.isLoading = false;
	}
}
</script>