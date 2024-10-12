<template>
	<div class="container">
		<p>Hello {{ this.user.name }} !!!! </p>
	</div>
</template>

<script>
export default {
	inject: ['user'],
}
</script>

<style scoped>
.container {
	background: aqua;
	height: 100%;
}
</style>
