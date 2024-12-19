<template>
	<div class="fixed top-0 left-0 flex items-center justify-between bg-white w-full sm:px-8 px-3 py-3 border-b z-50">
		<div class="flex gap-3 items-center">
			<Button v-if="!isDesktop"
					icon="pi pi-bars"
					severity="secondary"
					size="small"
					@click="$emit('toggle-sidebar')"
			/>

			<a class="text-xl font-semibold" href="/">PLAN<span class="text-blue-300">TOGETHER</span></a>
		</div>

		<div class="flex sm:gap-5 gap-3">
			<Button
				aria-controls="overlay_menu"
				aria-haspopup="true"
				icon="pi pi-language"
				severity="secondary"
				size="small"
				@click="toggle"
			/>
			<Menu
				id="overlay_menu"
				ref="menu"
				:model="items"
				:popup="true"
			/>

			<Button v-if="user"
					icon="pi pi-sign-out"
					severity="secondary"
					size="small"
					@click="logout"
			/>
		</div>
	</div>
</template>

<script>
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import enLocale from '../locales/en/primevue.json';
import frLocale from '../locales/fr/primevue.json';

export default {
	inject: ['user', 'logout', 'sidebar', 'isDesktop'],
	components: {
		Button, Menu
	},
	data() {
		return {
			items: [
				{label: 'Français', lang: 'fr', command: () => this.changeLanguage('fr')},
				{label: 'English', lang: 'en', command: () => this.changeLanguage('en')}
			]
		}
	},
	methods: {
		toggle(event) {
			this.$refs.menu.toggle(event);
		},
		changeLanguage(lang) {
			const locales = {
				en: enLocale,
				fr: frLocale
			};

			this.$primevue.config.locale = locales[lang];
			this.$i18n.locale = lang;
			this.$cookies.set('language', lang);
		}
	}
};
</script>