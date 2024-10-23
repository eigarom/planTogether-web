<template>
	<div v-if="loading">
		<p>Loading...</p>
	</div>
	<div v-else class="flex gap-3 w-full">
		<SidebarNavigation v-if="user && family" class="container"/>
		<router-view class="flex-grow justify-center items-center"></router-view>
	</div>
</template>

<script>
import {computed} from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import {getUserFromToken} from "@/services/userServices.js";
import {getFamilyFromToken} from "@/services/familyServices.js";

export default {
	components: {
		SidebarNavigation
	},
	data() {
		return {
			token: '',
			user: null,
			family: '',
			loading: true
		};
	},
	methods: {
		getToken() {
			this.token = this.$cookies.get('jwtToken');
		},
		async getUserDetails() {
			if (this.token) {
				try {
					this.user = await getUserFromToken(this.token);
					if (!this.user) {
						this.logout();
					}
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
		},
		async getFamilyDetails() {
			if (this.token) {
				try {
					this.family = await getFamilyFromToken(this.token);
					if (!this.family) {
						this.$router.push('/families/add');
					} else {
						this.$router.push('/events');
					}
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
		},
		logout() {
			this.$cookies.remove("jwtToken");
			window.location.href = "/";
		}
	},
	async mounted() {
		this.getToken();
		await this.getUserDetails();
		await this.getFamilyDetails();
		this.loading = false;
	},
	provide() {
		return {
			token: computed(() => this.token),
			user: computed(() => this.user),
			family: computed(() => this.family),
			logout: this.logout
		}
	}
}
</script>

<style>
.container {
	height: calc(100vh - 16px);
}
</style>
