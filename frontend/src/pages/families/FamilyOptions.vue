<template>
	<div class="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
		<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg w-[350px]">
			<h1 class="text-3xl font-medium text-center">{{ $t('familyOptionsTitle') }}</h1>

			<Button :label="$t('createFamily')" as="router-link" class="w-full" to="/families/add"/>

			<Button :label="$t('joinFamily')" as="router-link" to="/families/join"/>

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