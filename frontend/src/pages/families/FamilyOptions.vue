<template>
	<div class="w-80 pt-20">
		<h1 class="text-3xl font-medium mb-8 text-center">{{ $t('familyOptionsTitle') }}</h1>
		<div class="flex flex-col gap-5">
			<Button :label="$t('createFamily')" as="router-link" class="w-full" to="/families/add" />
			<Button :label="$t('joinFamily')" as="router-link" to="/families/join" />
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