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
* {
	box-sizing: border-box;
}

html, body, #app {
	height: 100%;
	margin: 0;
}

.app-container {
	display: flex;
	height: 100%;
}

.sidebar {
	width: 250px;
	height: 100%;
}

.main-content {
	flex-grow: 1;
	height: 100%;
}
</style>
