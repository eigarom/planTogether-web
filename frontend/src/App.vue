<template>
	<AppHeader/>
	<SidebarNavigation v-if="user && family"/>
	<main v-if="!isLoading" class="flex w-full pb-[75px]">
		<router-view></router-view>
	</main>
	<AppFooter/>
</template>

<script>
import {computed} from 'vue';
import SidebarNavigation from './components/SidebarNavigation.vue';
import {getUserFromToken} from "@/services/userServices.js";
import {getFamilyFromToken, getFamilyImage} from "@/services/familyServices.js";
import {getAllMembersByFamilyId, getMemberImage} from "@/services/memberServices.js";
import AppHeader from './components/AppHeader.vue';
import AppFooter from "@/components/AppFooter.vue";
import enLocale from "@/locales/en/primevue.json";
import frLocale from "@/locales/fr/primevue.json";

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
			isLoading: true
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
						await this.getAllFamilyMembers();
					} else {
						this.$router.push('/families/add-or-join');
					}
				} catch (error) {
					console.error('Erreur:', error);
				}
			}
		},
		async getAllFamilyMembers() {
			try {
				const familyMembers = await getAllMembersByFamilyId(this.token);
				this.family.accountMembers = this.sortMembersAlphabetically(familyMembers.accountMembers);
				for (const accountMember of this.family.accountMembers) {
					accountMember.imageUrl = await getMemberImage(this.token, accountMember.id);
				}
				this.family.guestMembers = this.sortMembersAlphabetically(familyMembers.guestMembers);
				for (const guestMember of this.family.guestMembers) {
					guestMember.imageUrl = await getMemberImage(this.token, guestMember.id);
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		},
		sortMembersAlphabetically(members) {
			return members.sort((a, b) => a.name.localeCompare(b.name));
		},
		logout() {
			this.$cookies.remove("jwtToken");
			this.$cookies.remove("language");
			window.location.href = "/";
		},
		chargeLanguage() {
			const savedLanguage = this.$cookies.get('language');
			const locales = {
				en: enLocale,
				fr: frLocale
			};

			if (savedLanguage) {
				this.$primevue.config.locale = locales[savedLanguage];
				this.$i18n.locale = savedLanguage;
			}
		}
	}
	,
	async created() {
		this.initializeLanguage();
		this.getToken();
		await this.getUserDetails();
		await this.getFamilyDetails();
		this.chargeLanguage();
		this.isLoading = false;
	}
	,
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
