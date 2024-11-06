<template>
	<FloatingTitle/>

	<div class="flex h-full justify-center items-center">
		<div class="w-80">
			<h1 class="text-3xl mb-8 text-center font-medium">{{ $t('createFamily') }}</h1>
			<form id="familycreationForm" class="flex flex-col gap-5" @submit.prevent="submitCreateFamily">

				<FloatLabel variant="on">
					<InputText id="name" v-model.trim="name" class="w-full"/>
					<label for="name">{{ $t('familyName') }}</label>
				</FloatLabel>


				<div class="flex justify-between px-3">
					<label class="font-medium" for="color">{{ $t('commonEventsColor') }}</label>
					<ColorPicker v-model="color" format="hex" inputId="color"/>
				</div>

				<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isCreateFamilyDisabled" :label=" $t('confirmButton')" raised type="submit"/>
			</form>
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import {createFamily} from "@/services/familyServices.js";
import {familySchema} from "@/schemas/familySchemas.js";
import FloatingTitle from "@/components/AppHeader.vue";

export default {
	components: {
		FloatingTitle, InputText, Button, Message, FloatLabel, ColorPicker
	},
	data: () => {
		return {
			name: "",
			color: "#358BE6",
			errorMessage: ""
		};
	},
	computed: {
		isCreateFamilyDisabled() {
			return !this.name
		}
	},
	methods: {
		async submitCreateFamily() {
			this.errorMessage = "";

			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}

			const newFamily = {
				name: this.name,
				color: this.color
			}

			try {
				await familySchema.validate(newFamily);
				const token = this.$cookies.get('jwtToken');
				const result = await createFamily(newFamily, token);
				this.$cookies.set("jwtToken", result.token);
				window.location.href = '/';
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = "Échec de la création de la famille.";
				}
			}
		}
	}
};
</script>
