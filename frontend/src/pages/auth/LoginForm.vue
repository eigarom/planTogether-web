<template>
	<div class="container">
		<h1>LOGIN</h1>
		<form id="loginForm" @submit.prevent="submitLogin">
			<div>
				<input id="email" v-model.trim="email" name="email" type="text"/>
			</div>
			<div>
				<input id="password" v-model.trim="password" name="password" type="password"/>
			</div>
			<div>
				<span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
			</div>
			<button type="submit">Login</button>
		</form>
	</div>
</template>
<script>
import {login} from "@/services/authServices.js";
import {loginSchema} from "@/schemas/authSchemas.js";

export default {
	data: () => {
		return {
			email: "",
			password: "",
			errorMessage: ""
		};
	},
	methods: {
		async submitLogin() {
			this.errorMessage = "";
			const {error} = loginSchema.validate({email: this.email, password: this.password});

			if (error) {
				this.errorMessage = error.message;
			} else {
				try {
					const token = await login(this.email, this.password);
					this.$cookies.set("jwtToken", token);
					window.location.href = '/';
				} catch (err) {
					this.errorMessage = "Échec de l'authentification."
					console.error("An error occurred:", err);
				}
			}
		}
	}
};
</script>

<style>
.container {
	background: aqua;
	width: 100%;
}
</style>