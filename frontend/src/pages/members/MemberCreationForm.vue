<template>
	<div class="flex h-full justify-center items-center">
		<div class="w-80">
			<h1 class="text-3xl mb-8 text-center">{{ $t('memberTitle') }}</h1>
			<form id="profileForm" class="flex flex-col gap-5" @submit.prevent="submitCreateMember">
				<div class="flex flex-inline items-center justify-between">
					<FloatLabel variant="on">
						<InputText id="name" v-model.trim="name" class="w-60"/>
						<label for="name">{{ $t('memberName') }}</label>
					</FloatLabel>
					<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>
				</div>
				<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" raised type="submit"/>
			</form>

			<Toast ref="toast" position="bottom-right"/>
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import Toast from 'primevue/toast';
import {memberSchema} from "@/schemas/memberSchemas.js";
import {createMember} from "@/services/memberServices.js";

export default {
	inject: ['token'],
	components: {
		InputText, Button, Message, FloatLabel, ColorPicker, Toast
	},
	data: () => {
		return {
			name: '',
			color: '#FF0000',
			errorMessage: "",
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return !this.name && !this.color;
		}
	},
	methods: {
		async submitCreateMember() {
			this.errorMessage = "";

			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}

			const memberInformations = {
				name: this.name,
				color: this.color
			}

			try {
				await memberSchema.validate({name: this.name, color: this.color});
				await createMember(memberInformations, this.token);
				this.$router.push('/events');
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = "Échec lors de la création.";
				}
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