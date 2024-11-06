<template>
	<AppHeader />
	<div v-if="!isLoading" class="flex gap-3 w-full h-screen p-3 bg-surface-50 pt-20">
		<SidebarNavigation v-if="user && family" />
		<main class="flex-grow">
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
import { computed } from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import { getUserFromToken } from "@/services/userServices.js";
import { getFamilyFromToken } from "@/services/familyServices.js";
import { getMemberImage } from "@/services/memberServices.js";
import { getFamilyImage } from "@/services/familyServices.js";
import AppHeader from './components/AppHeader.vue';

export default {
	components: {
		AppHeader, SidebarNavigation
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
					this.family.imageUrl = await getFamilyImage(this.token, this.family.id);
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
		},
		logout() {
			this.$cookies.remove("jwtToken");
			window.location.href = "/";
		},
		chargeLanguage() {
			const savedLanguage = this.$cookies.get('language');
			if (savedLanguage) {
				this.$i18n.locale = savedLanguage;
			}
		}
	},
	async created() {
		this.getToken();
		await this.getUserDetails();
		await this.getFamilyDetails();
		this.chargeLanguage();
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
