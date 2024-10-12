<template>
	<header>
		<div class="container">
			<div class="title">
				<h1>PlanTogether</h1>
				<p>Planificateur familial</p>
			</div>

			<div>
				<button @click="logout">Déconnexion</button>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	methods: {
		logout() {
			this.$cookies.remove("jwtToken");
			window.location.href = "/";
		}
	}
}
</script>

<style scoped>
.container {
	background: pink;
	height: 100%;
}

h1 {
	margin: 0;
}
</style>
