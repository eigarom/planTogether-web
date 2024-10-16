<template>
	<div>
		<p>Hello {{ this.user.name }} !!!! </p>
	</div>
</template>

<script>
export default {
	inject: ['user'],
}
</script>

<style scoped>

</style>
