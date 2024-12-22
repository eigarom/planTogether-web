<template>
	<FloatingTitle/>

	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center p-5">
		<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg w-full sm:w-[350px]">
			<h1 class="text-3xl text-center font-medium">{{ $t('joinFamily') }}</h1>

			<form id="familyJoinForm" class="flex flex-col gap-8" @submit.prevent="submitJoinFamily">

				<FloatLabel variant="on">
					<InputText id="inviteCode" v-model.trim="inviteCode" class="w-full"/>
					<label for="inviteCode">{{ $t('inviteCode') }}</label>
				</FloatLabel>

				<Button :disabled="isButtonDisabled" :label="$t('confirmButton')" raised type="submit"/>
			</form>
		</div>

		<Toast ref="toast" position="bottom-right"/>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import FloatingTitle from "@/components/AppHeader.vue";
import {joinFamily} from "@/services/familyServices.js";
import Toast from "primevue/toast";

export default {
	components: {
		Toast, FloatingTitle, InputText, Button, FloatLabel
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

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		}
	}
}
;
</script>
