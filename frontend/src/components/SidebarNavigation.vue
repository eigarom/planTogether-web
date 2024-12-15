<template>
	<Menu id="sidebar" :model="items" class="fixed left-5 z-40 p-2 h-[calc(100%-148px)] w-52">
		<template #item="{ item, props }">
			<!-- Item du profil -->
			<template v-if="item.route === '/profile'">
				<router-link v-slot="{ href, navigate }" :to="item.route" custom>
					<a :href="href" v-bind="props.action"
					   @click="navigate">
						<Avatar
							:image="user.imageUrl"
							:label="!user.imageUrl ? userInitial : null"
							:style="!user.imageUrl ? `background-color: ${user.color}` : null"
							class="font-semibold text-white flex-shrink-0"
							shape="circle"
							size="small"
						/>

						<div class="flex flex-col justify-between">
							<p class="truncate">{{ user.name }}</p>
							<p class="text-xs">{{ family.name }}</p>
						</div>
					</a>
				</router-link>
			</template>

			<!-- Item de l'image de la famille (non cliquable) -->
			<template v-else-if="item.type === 'familyImage'">
				<div class="flex flex-col items-center my-2">
					<Image :src="family.imageUrl" alt="Image famille" image-class="rounded"/>
				</div>
			</template>

			<!-- Autres items (calendrier, ma famille) -->
			<template v-else>
				<router-link v-slot="{ href, navigate }" :to="item.route" custom>
					<a :href="href" v-bind="props.action" @click="navigate">
						<span :class="item.icon"/>
						<span class="ml-2">{{ item.label }}</span>
					</a>
				</router-link>
			</template>
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
			let profileItem = {label: this.user.name, route: '/profile'};
			let familyImageItem = this.family.imageUrl ? {type: 'familyImage'} : null;
			let baseItems = [
				{label: this.$t('calendarMenu'), icon: 'pi pi-calendar', route: '/events'},
				{label: this.$t('familyMenu'), icon: 'pi pi-users', route: '/my-family'},
			];
			return familyImageItem
				? [profileItem, familyImageItem, ...baseItems]
				: [profileItem, ...baseItems];
		}
	}
}
</script>
