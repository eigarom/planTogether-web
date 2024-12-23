<template>
	<div class="fixed top-0 left-0 w-screen h-screen overflow-y-auto">
		<!-- Section avec le dégradé et l'arc -->
		<div
			class="w-full h-[100vh]"
			style="background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
             clip-path: ellipse(120% 60% at 80% 30%);"
		>
			<!-- Accroche -->
			<div class="flex flex-col gap-5 px-10 sm:pl-28 pt-24 sm:pt-32 w-full">

				<p class="text-5xl font-bold">{{ $t('landingTitle') }}</p>

				<p class="text-2xl font-thin">{{ $t('landingSubtitle') }}</p>

				<Button as="router-link" class="flex items-center gap-2 w-36" to="/register">
					<p>{{ $t('landingButton') }}</p>
					<i class="pi pi-arrow-right"/>
				</Button>

			</div>

			<div class="relative w-[90vw] sm:w-[600px] mx-auto sm:ml-auto sm:mr-8 mt-8">
				<img
					:src="webSample"
					alt="web sample"
					class="w-full rounded absolute top-10 sm:top-16 left-0 shadow-lg"
				/>
				<img
					:src="mobileSample"
					alt="mobile sample"
					class="w-[100px] sm:w-[180px] rounded absolute top-0 right-3 sm:right-4 shadow-lg"
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
			mobileSampleEn, webSampleEn, mobileSampleFr, webSampleFr
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
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}
</style>