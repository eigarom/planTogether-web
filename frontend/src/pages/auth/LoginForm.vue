<template>
	<div class="flex align-items-center justify-content-center min-h-screen">
		<div class="flex flex-column ">
			<h1 class="align-self-center">Bienvenue</h1>
			<form id="loginForm" class="flex flex-column row-gap-3 align-content-center w-20rem"
				  @submit.prevent="submitLogin">
				<InputGroup>
					<InputGroupAddon>
						<i class="pi pi-envelope"></i>
					</InputGroupAddon>
					<FloatLabel variant="in">
						<InputText id="email" v-model.trim="email"/>
						<label for="email">Courriel</label>
					</FloatLabel>
				</InputGroup>

				<InputGroup>
					<InputGroupAddon>
						<i class="pi pi-lock"></i>
					</InputGroupAddon>
					<FloatLabel variant="in">
						<Password v-model.trim="password" :feedback="false" inputId="password" toggleMask/>
						<label for="password">Mot de passe</label>
					</FloatLabel>
				</InputGroup>

				<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isLoginDisabled" label="Se connecter" type="submit"/>
			</form>

			<p class="align-self-center">Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous</a></p>
		</div>
	</div>
</template>

<script>
import {login} from "@/services/authServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import Message from 'primevue/message';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import FloatLabel from "primevue/floatlabel";

export default {
	components: {
		InputText, Button, Password, Message, InputGroup, InputGroupAddon, FloatLabel
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
			} catch (err) {
				this.errorMessage = "Échec de l'authentification.";
			}
		}
	}
};
</script>