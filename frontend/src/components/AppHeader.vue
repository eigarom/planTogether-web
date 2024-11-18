<template>
	<div class="fixed top-0 left-0 flex items-center justify-between bg-white w-full px-8 py-3 border-b z-50">
		<span class="text-xl font-semibold">PLAN<span class="text-blue-300">TOGETHER</span></span>
		<div class="card flex justify-center">
			<Button aria-controls="overlay_menu"
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
				:popup="true"/>
		</div>
	</div>
</template>

<script>
import Button from 'primevue/button';
import Menu from 'primevue/menu';

export default {
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
			this.$i18n.locale = lang;
			this.$cookies.set('language', lang);
		}
	}
};
</script>