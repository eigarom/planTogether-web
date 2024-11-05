<template>
	<div class="flex h-full justify-center items-center">
		<div class="w-80">
			<h1 class="text-3xl font-medium mb-8 text-center">Créer ou rejoindre une famille</h1>
			<div class="flex flex-col gap-5">
				<Button as="router-link" class="w-full" label="Créer une famille" to="/families/add"/>
				<Button as="router-link" label="Rejoindre une famille" to="/families/join"/>
			</div>
		</div>
	</div>
</template>

<script>
import Button from "primevue/button";

export default {
	components: {
		Button
	}
}
</script>