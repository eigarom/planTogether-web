<template>
	<div class="w-full max-w-sm">
		<h1 class="text-4xl mb-3 text-center lato-regular">Bienvenue</h1>
		<form id="loginForm" class="flex flex-col gap-3"
			  @submit.prevent="submitLogin">
			<FloatLabel variant="on">
				<InputText id="email" v-model.trim="email" class="w-full"/>
				<label for="email">Courriel</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<Password v-model.trim="password" :feedback="false" class="w-full" input-class="w-full"
						  inputId="password"
						  toggleMask/>
				<label for="password">Mot de passe</label>
			</FloatLabel>

			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isLoginDisabled" label="Se connecter" type="submit"/>
		</form>

		<p class="mt-3 lato-light text-center">Vous n'avez pas de compte ? <a class="text-blue-400"
																			  href="/register">Inscrivez-vous</a>
		</p>
	</div>
</template>

<script>
import {login} from "@/services/authServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";

export default {
	components: {
		InputText, Button, Password, Message, FloatLabel
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
			this.errorMessage = "";
			try {
				const token = await login(this.email, this.password);
				this.$cookies.set("jwtToken", token);
				window.location.href = '/';
			} catch {
				this.errorMessage = "Échec de l'authentification.";
			}
		}
	}
};
</script>