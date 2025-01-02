<template>
	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center p-5">
		<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg sm:w-[350px] w-full">
			<h1 class="text-3xl font-medium text-center">{{ $t('createAccount') }}</h1>

			<form id="registerForm" class="flex flex-col gap-8" @submit.prevent="submitRegistration">
				<FloatLabel variant="on">
					<InputText id="email" v-model.trim="email" class="w-full"/>
					<label for="email">{{ $t('mail') }}</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<Password v-model.trim="password" class="w-full" input-class="w-full"
							  inputId="password"
							  toggleMask>
						<template #content>
							<span class="font-semibold text-xm mb-2">{{ $t('passwordDescription') }}</span>
							<ul class="pl-2 ml-2 my-0 leading-normal">
								<li>{{ $t('passwordRule1') }}</li>
								<li>{{ $t('passwordRule2') }}</li>
								<li>{{ $t('passwordRule3') }}</li>
								<li>{{ $t('passwordRule4') }}</li>
								<li>{{ $t('passwordRule5') }}</li>
							</ul>
						</template>
					</Password>
					<label for="password">{{ $t('password') }}</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<Password v-model.trim="repeat_password" :feedback="false" class="w-full" fluid
							  input-class="w-full" inputId="repeat_password" toggleMask/>
					<label for="repeat_password">{{ $t('passwordConfirmation') }}</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputText id="name" v-model.trim="name" class="w-full"/>
					<label for="name">{{ $t('firstname') }}</label>
				</FloatLabel>

				<Button :disabled="isRegistrationDisabled" :label="$t('signup')" raised type="submit"/>
			</form>

			<p class="font-light text-center">{{ $t('alreadyRegistered') }}
				<a class="text-blue-400 font-light" href="/login">{{ $t('login') }}</a>
			</p>
		</div>

		<Toast ref="toast" :pt="{root: { style: 'width: 90% ; max-width: 400px' }}" position="bottom-right"/>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import FloatLabel from "primevue/floatlabel";
import {registrationSchema} from "@/schemas/authSchemas.js";
import {register} from "@/services/authServices.js";
import Toast from "primevue/toast";

export default {
	components: {
		Toast, InputText, Button, Password, FloatLabel
	},
	data: () => {
		return {
			email: "",
			password: "",
			repeat_password: "",
			name: "",
			errorMessage: ""
		};
	},
	computed: {
		isRegistrationDisabled() {
			return !this.email || !this.password || !this.repeat_password || !this.name;
		}
	},
	methods: {
		async submitRegistration() {
			const userInformations = {
				email: this.email,
				password: this.password,
				repeat_password: this.repeat_password,
				name: this.name
			}

			try {
				await registrationSchema.validate(userInformations);
				const token = await register(this.email, this.password, this.name);
				this.$cookies.set("jwtToken", token);
				window.location.href = '/';
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = this.$t(err.message);
				} else if (err.message === "Courriel non disponible")
					this.errorMessage = this.$t('unavailableMail');
				else
					this.errorMessage = this.$t('registerFailed');

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