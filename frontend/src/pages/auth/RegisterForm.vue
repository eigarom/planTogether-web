<template>
	<div class="flex align-items-center justify-content-center min-h-screen">
		<div class="flex flex-column ">
			<h1 class="align-self-center">Créer un compte</h1>
			modification
			<form id="registerForm" class="flex flex-column row-gap-3 align-content-center w-20rem"
				  @submit.prevent="submitRegistration">
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

				<InputGroup>
					<InputGroupAddon>
						<i class="pi pi-lock"></i>
					</InputGroupAddon>
					<FloatLabel variant="in">
						<Password v-model.trim="repeat_password" :feedback="false" inputId="repeat_password"
								  toggleMask/>
						<label for="repeat_password">Confirmation mot de passe</label>
					</FloatLabel>
				</InputGroup>

				<InputGroup>
					<InputGroupAddon>
						<i class="pi pi-user"></i>
					</InputGroupAddon>
					<FloatLabel variant="in">
						<InputText id="name" v-model.trim="name"/>
						<label for="name">Nom</label>
					</FloatLabel>
				</InputGroup>

				<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isRegistrationDisabled" label="S'inscrire" type="submit"/>
			</form>

			<p class="align-self-center">Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import Message from 'primevue/message';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import FloatLabel from "primevue/floatlabel";
import {registrationSchema} from "@/schemas/authSchemas.js";
import {register} from "@/services/authServices.js";

export default {
	components: {
		InputText, Button, Password, Message, InputGroup, InputGroupAddon, FloatLabel
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
			this.errorMessage = "";
			const userInformations = {
				email: this.email,
				password: this.password,
				repeat_password: this.repeat_password,
				name: this.name
			}
			const {error} = registrationSchema.validate(userInformations);
			if (error) {
				this.errorMessage = error.message;
				return
			}

			try {
				const token = await register(this.email, this.password, this.name);
				this.$cookies.set("jwtToken", token);
				window.location.href = '/';
			} catch (err) {
				if (err.message === "Courriel non disponible")
					this.errorMessage = "Le courriel n'est pas disponible";
				else
					this.errorMessage = "Échec de l'authentification.";
			}
		}
	}
};
</script>