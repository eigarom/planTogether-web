<template>
	<Menu :model="items" class="m-3 ">
		<template #start>
			<div class="flex flex-col items-center mt-2">
				<span class="text-xl font-semibold">PLAN<span class="text-blue-200">TOGETHER</span></span>

				<Image :src="`/api/families/my-family/image?token=${token}`" alt="Image famille" width="170"/>
			</div>

		</template>
		<template #item="{ item, props }">
			<router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
				<a :href="href" v-bind="props.action" @click="navigate">
					<span :class="item.icon"/>
					<span class="ml-2">{{ item.label }}</span>
				</a>
			</router-link>
			<a v-else v-bind="props.action" @click="item.action">
				<span :class="item.icon"/>
				<span class="ml-2">{{ item.label }}</span>
			</a>
		</template>
		<template #end>
			<div class="inline-flex items-center gap-3 ml-3">
				<Avatar :image="`/api/users/me/image?token=${token}`" class="border-2" shape="circle" size="large"/>
				<span class="lato-bold">{{ user.name }}</span>
			</div>
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
	inject: ['token', 'user', 'logout'],
	data() {
		return {
			items: [
				{separator: true},
				{label: 'Calendrier', icon: 'pi pi-calendar', route: '/events'},
				{label: 'Paramètres', icon: 'pi pi-cog', route: '/settings'},
				{label: 'Se déconnecter', icon: 'pi pi-sign-out', action: this.logout},
				{separator: true}
			]
		};
	}
}
</script>