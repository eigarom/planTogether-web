<template>
	<AppHeader />
	<SidebarNavigation v-if="user && family"/>
	<main v-if="!isLoading" class="flex w-full pb-20">
		<router-view></router-view>
	</main>
	<AppFooter />
</template>

<script>
import {computed} from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import {getUserFromToken} from "@/services/userServices.js";
import {getFamilyFromToken, getFamilyImage} from "@/services/familyServices.js";
import {getMemberImage} from "@/services/memberServices.js";
import AppHeader from './components/AppHeader.vue';
import AppFooter from "@/components/AppFooter.vue";

export default {
	components: {
		AppFooter,
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
		initializeLanguage() {
			this.$i18n.locale = this.$cookies.get('lang') || 'fr';
		},
		getToken() {
			this.token = this.$cookies.get('jwtToken');
		},
		async getUserDetails() {
			if (this.token) {
				try {
					this.user = await getUserFromToken(this.token);
					if (this.user) {
						this.user.imageUrl = await getMemberImage(this.token, this.user.id);
					} else {
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
					if (this.family) {
						this.family.imageUrl = await getFamilyImage(this.token, this.family.id);
					} else {
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
		},
		chargeLanguage() {
			const savedLanguage = this.$cookies.get('language');
			if (savedLanguage) {
				this.$i18n.locale = savedLanguage;
			}
		}
	},
	async created() {
		this.initializeLanguage();
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
