<template>
	<div class="container">
		<h1>LOGIN</h1>
		<form @submit.prevent="submitLogin">
			<input v-model="email" placeholder="email"/>
			<input v-model="password" placeholder="password" type="password"/>
			<button type="submit">Login</button>
		</form>
	</div>
</template>
<script>
import {login} from "@/services/authServices.js";

export default {
	data: () => {
		return {
			email: "",
			password: "",
		};
	},
	methods: {
		async submitLogin() {
			try {
				const token = await login(this.email, this.password);
				this.$cookies.set("jwtToken", token, "100d");
				window.location.href = '/';
			} catch (error) {
				console.error("An error occurred:", error);
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