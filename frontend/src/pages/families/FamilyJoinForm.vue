<template>
	<FloatingTitle />

	<div class="w-80 pt-20">
		<h1 class="text-3xl mb-8 text-center font-medium">{{ $t('joinFamily') }}</h1>
		<form id="familyJoinForm" class="flex flex-col gap-5" @submit.prevent="submitJoinFamily">

			<FloatLabel variant="on">
				<InputText id="inviteCode" v-model.trim="inviteCode" class="w-full" />
				<label for="inviteCode">{{ $t('inviteCode') }}</label>
			</FloatLabel>

			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isButtonDisabled" :label="$t('confirmButton')" raised type="submit" />
		</form>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import FloatingTitle from "@/components/AppHeader.vue";
import {joinFamily} from "@/services/familyServices.js";

export default {
	components: {
		FloatingTitle, InputText, Button, Message, FloatLabel
	},
	data: () => {
		return {
			inviteCode: "",
			errorMessage: ""
		};
	},
	computed: {
		isButtonDisabled() {
			return !this.inviteCode;
		}
	},
	methods: {
		async submitJoinFamily() {
			this.errorMessage = "";

			try {
				const token = this.$cookies.get('jwtToken');
				const result = await joinFamily(this.inviteCode, token);
				this.$cookies.set("jwtToken", result.token);
				window.location.href = '/';
			} catch (err) {
				if (err.message === "Code d'invitation invalide ou expiré") {
					this.errorMessage = this.$t('invalidInviteCode');
				} else {
					this.errorMessage = this.$t('joinErrorMessage');
				}
			}
		}
	}
}
	;
</script>
