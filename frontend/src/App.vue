<template>
	<div v-if="loading" class="app-container">
		<p>Loading...</p>
	</div>
	<div v-else class="app-container">
		<SidebarNavigation v-if="user" class="sidebar"/>
		<router-view class="main-content"></router-view>
	</div>
</template>

<script>

import {computed} from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import {getUserInfo} from "@/services/userServices.js";

export default {
	components: {
		SidebarNavigation
	},
	data() {
		return {
			user: null,
			loading: true
		};
	},
	methods: {
		async getUserFromToken() {
			const token = this.$cookies.get('jwtToken');
			if (token) {
				try {
					this.user = await getUserInfo(token);
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
			this.loading = false;
		}
	},
	mounted() {
		this.getUserFromToken();
	},
	provide() {
		return {
			user: computed(() => this.user)
		}
	}
}
</script>

<style>
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';

</style>
