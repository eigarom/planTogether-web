<template>
	<div class="w-full max-w-sm">
		<h1 class="text-4xl mb-3 text-center lato-regular">Créer un compte</h1>
		<form id="registerForm" class="flex flex-col gap-3"
			  @submit.prevent="submitRegistration">

			<FloatLabel variant="on">
				<InputText id="email" v-model.trim="email" class="w-full"/>
				<label for="email">Courriel</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<Password v-model.trim="password" class="w-full" input-class="w-full"
						  inputId="password"
						  toggleMask>
					<template #content>
						<div class="font-semibold text-xm mb-2">Le mot de passe doit comporter au moins :</div>
						<ul class="pl-2 ml-2 my-0 leading-normal">
							<li>Une minuscule</li>
							<li>Une majuscule</li>
							<li>Un chiffre</li>
							<li>Un caractère spécial</li>
							<li>16 caractères</li>
						</ul>
					</template>
				</Password>
				<label for="password">Mot de passe</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<Password v-model.trim="repeat_password" :feedback="false" class="w-full"
						  input-class="w-full" inputId="repeat_password" toggleMask/>
				<label for="repeat_password">Confirmation du mot de passe</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<InputText id="name" v-model.trim="name" class="w-full"/>
				<label for="name">Prénom</label>
			</FloatLabel>

			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isRegistrationDisabled" label="S'inscrire" type="submit"/>
		</form>

		<p class="mt-3 lato-light text-center">Vous avez déjà un compte ? <a class="text-blue-400" href="/login">Connectez-vous</a>
		</p>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Password from 'primevue/password';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import FloatLabel from "primevue/floatlabel";
import {registrationSchema} from "@/schemas/authSchemas.js";
import {register} from "@/services/authServices.js";

export default {
	components: {
		InputText, Button, Password, Message, FloatLabel, Divider
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