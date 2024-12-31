<template>
	<div class="fixed top-0 left-0 w-screen h-screen overflow-y-auto">
		<div
			class="flex flex-col sm:flex-row h-fit pt-24 sm:pt-32 bg-gradient-to-r from-blue-300 to-blue-100 clip-path-mobile clip-path-desktop">
			<!-- Accroche -->
			<div class="flex flex-col gap-5 px-10 sm:pl-28 sm:w-[1200px]">

				<p class="text-4xl sm:text-5xl font-bold">{{ $t('landingTitle') }}</p>

				<p class="text-2xl font-light">{{ $t('landingSubtitle') }}</p>

				<div class="flex flex-col gap-2">
					<div v-for="feature in features" :key="feature.key" class="inline-flex items-center gap-5">
						<i class="pi pi-check-square text-3xl text-green-600"/>
						<p class="text-lg font-light">{{ $t(feature.translationKey) }}</p>
					</div>
				</div>

				<Button as="router-link" class="flex items-center gap-2 w-36" to="/register">
					<p>{{ $t('landingButton') }}</p>
					<i class="pi pi-arrow-right"/>
				</Button>

			</div>

			<!-- Images samples -->
			<div class="relative w-[90vw] sm:w-full mx-auto sm:ml-auto sm:mr-8 mt-24 sm:mt-32 mb-48">
				<img
					:src="webSample"
					alt="web sample"
					class="w-full rounded shadow-lg"
				/>
				<img
					:src="mobileSample"
					alt="mobile sample"
					class="w-[30%] rounded absolute top-[-40px] sm:top-[-64px] right-3 sm:right-4 shadow-xl"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Button from "primevue/button";
import mobileSampleEn from "@/assets/images/mobileSampleEn.png";
import mobileSampleFr from "@/assets/images/mobileSampleFr.png";
import webSampleEn from "@/assets/images/webSampleEn.png";
import webSampleFr from "@/assets/images/webSampleFr.png";

export default {
	components: {
		Button
	},
	data() {
		return {
			mobileSampleEn, webSampleEn, mobileSampleFr, webSampleFr,
			features: [
				{key: 'calendar', translationKey: 'feature-calendar'},
				{key: 'taskslists', translationKey: 'feature-taskslists'},
				{key: 'shoppinglists', translationKey: 'feature-shoppinglists'}
			]
		};
	},
	computed: {
		webSample() {
			return this.$i18n.locale === 'fr' ? this.webSampleFr : this.webSampleEn;
		},
		mobileSample() {
			return this.$i18n.locale === 'fr' ? this.mobileSampleFr : this.mobileSampleEn;
		}
	}
};
</script>

<style scoped>
.clip-path-mobile {
	clip-path: ellipse(150% 60% at 80% 20%);
}

@media (min-width: 640px) {
	.clip-path-desktop {
		clip-path: ellipse(120% 45% at 80% 30%);
	}
}
</style>