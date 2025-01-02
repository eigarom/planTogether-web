<template>
	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center p-5">
		<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg w-full sm:w-[350px]">
			<h1 class="text-3xl text-center font-medium">{{ $t('createFamily') }}</h1>

			<form id="familycreationForm" class="flex flex-col gap-8" @submit.prevent="submitCreateFamily">

				<div class="flex gap-8 w-full">
					<FloatLabel class="w-full" variant="on">
						<InputText id="name" v-model.trim="name" class="w-full"/>
						<label for="name">{{ $t('familyName') }}</label>
					</FloatLabel>

					<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>
				</div>

				<Button :disabled="isCreateFamilyDisabled" :label="$t('confirmButton')" raised type="submit"/>
			</form>
		</div>

		<Toast ref="toast" :pt="{root: { style: 'width: 90% ; max-width: 400px' }}" position="bottom-right"/>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import {createFamily} from "@/services/familyServices.js";
import {familySchema} from "@/schemas/familySchemas.js";
import Toast from "primevue/toast";

export default {
	components: {
		Toast, InputText, Button, FloatLabel, ColorPicker
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
					this.errorMessage = this.$t('createFamilyFailed');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		}
	}
};
</script>

<style scoped>
.custom-color-picker {
	--p-colorpicker-preview-width: 42px;
	--p-colorpicker-preview-height: 42px;
}
</style>