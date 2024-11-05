<template>
	<div v-if="!isLoading" class="flex gap-3 w-full h-screen p-3 bg-surface-50">
		<SidebarNavigation v-if="user && family"/>
		<div class="flex-grow">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import {computed} from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import {getUserFromToken} from "@/services/userServices.js";
import {getFamilyFromToken} from "@/services/familyServices.js";
import {getMemberImage} from "@/services/memberServices.js";

export default {
	components: {
		SidebarNavigation
	},
	data() {
		return {
			token: '',
			user: null,
			family: '',
			isLoading: true,
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
					this.user.imageUrl = await getMemberImage(this.token, this.user.id);
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
						this.$router.push('/families/add-or-join');
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
	async created() {
		this.getToken();
		await this.getUserDetails();
		await this.getFamilyDetails();
		this.isLoading = false;
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
