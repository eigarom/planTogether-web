<template>
	<Menu v-if="!isLoading" id="sidebar" :model="items" class="p-1 h-fit">
		<template #start>
			<div class="flex justify-center">
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
			<div class="flex flex-col gap-3">
				<div class="inline-flex items-center justify-between">
					<router-link class="inline-flex items-center px-3 py-2 gap-3 " to="/profile">
						<Avatar v-if="user.imageUrl" :image="user.imageUrl"
								shape="circle" size="small"/>
						<Avatar v-else :label="userInitial" :style="`background-color: ${user.color}`"
								class="font-semibold text-white" shape="circle" size="small"/>
						<span class="font-black">{{ user.name }}</span>
					</router-link>
					<span class="pi pi-sign-out pr-3" @click="logout"></span>
				</div>
			</div>
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
			familyImageUrl: '',
			isLoading: true,
			dialogVisible: false,
			inviteCode: ''
		};
	},
	computed: {
		userInitial() {
			return this.user.name.charAt(0).toUpperCase();
		},
		items() {
			return [
				{separator: true},
				{label: this.$t('calendar'), icon: 'pi pi-calendar', route: '/events'},
				{separator: true}
			];
		}
	},
	async created() {
		this.familyImageUrl = await getFamilyImage(this.token);
		this.isLoading = false;
	}
}
</script>