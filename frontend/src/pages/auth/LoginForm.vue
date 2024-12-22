<template>
	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center p-5">
		<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg sm:w-[350px] w-full">

			<h1 class="text-3xl text-center">{{ $t('welcome') }}</h1>

			<form id="loginForm" class="flex flex-col gap-8" @submit.prevent="submitLogin">
				<FloatLabel variant="on">
					<InputText id="email" v-model.trim="email" class="w-full"/>
					<label for="email">{{ $t('mail') }}</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<Password v-model.trim="password" :feedback="false" class="w-full" input-class="w-full"
							  inputId="password" toggleMask/>
					<label for="password">{{ $t('password') }}</label>
				</FloatLabel>

				<Button :disabled="isLoginDisabled" :label="$t('login')" raised type="submit"/>
			</form>

			<p class="font-light text-center">{{ $t('noAccount') }}
				<a class="text-blue-400" href="/register">{{ $t('subscribe') }}</a>
			</p>
		</div>

		<Toast ref="toast" position="bottom-right"/>
	</div>
</template>

<script>
import {login} from "@/services/authServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import FloatLabel from "primevue/floatlabel";
import Toast from "primevue/toast";
import {loginSchema} from "@/schemas/authSchemas.js";

export default {
	components: {
		Toast, InputText, Button, Password, FloatLabel
	},
	data: () => {
		return {
			email: "",
			password: "",
			errorMessage: "",
		};
	},
	computed: {
		isLoginDisabled() {
			return !this.email || !this.password;
		}
	},
	methods: {
		async submitLogin() {
			const userInformations = {
				email: this.email,
				password: this.password
			}

			try {
				await loginSchema.validate(userInformations);
				const token = await login(this.email, this.password);
				this.$cookies.set("jwtToken", token);
				window.location.href = '/';
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = this.$t(err.message);
				} else
					this.errorMessage = this.$t('loginFailed');

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