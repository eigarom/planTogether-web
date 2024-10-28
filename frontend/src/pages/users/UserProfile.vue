<template>
	<div v-if="user" class="flex h-full justify-center items-center">
		<div class="w-80">
			<h1 class="text-3xl mb-8 text-center">Mon profil</h1>
			<form id="loginForm" class="flex flex-col gap-5" @submit.prevent="submitUpdateUser">
				<div class="flex flex-inline items-center justify-between">
					<FloatLabel variant="on">
						<InputText id="name" v-model.trim="name" class="w-60"/>
						<label for="name">Nom</label>
					</FloatLabel>
					<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>
				</div>

				<FloatLabel variant="on">
					<InputText id="email" v-model.trim="email" class="w-full"/>
					<label for="email">Courriel</label>
				</FloatLabel>

				<div class="card flex flex-inline items-center justify-between">
					<div class="flex flex-col gap-3">
						<FileUpload auto chooseLabel="Choisir une image"
									class="p-button-outlined"
									customUpload mode="basic" severity="secondary" @select="onImageSelect"/>
						<Button v-if="user.imageUrl" icon="pi pi-minus" label="Supprimer l'image" outlined
								severity="warn"
								@click="deleteUserImage"/>
					</div>
					<img v-if="user.imageUrl" :src="user.imageUrl" alt="Image" class="shadow-md rounded-xl h-24"/>
				</div>

				<Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isSubmitButtonDisabled" label="Enregistrer les modifications" raised type="submit"/>
			</form>

			<Toast ref="toast" position="bottom-right"/>
		</div>
	</div>
</template>

<script>
import {updateUser} from "@/services/userServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import {userSchema} from "@/schemas/userSchemas.js";
import {deleteUserImage, uploadMemberImage} from "@/services/memberServices.js";

export default {
	inject: ['user', 'token'],
	components: {
		InputText, Button, Message, FloatLabel, ColorPicker, FileUpload, Toast
	},
	data: () => {
		return {
			name: '',
			email: '',
			color: '',
			lang: '',
			theme: '',
			userImageUrl: '',
			errorMessage: "",
			success: false,
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return this.name === this.user.name && this.email === this.user.email && this.color === this.user.color;
		}
	},
	methods: {
		initializeUserData() {
			this.name = this.user.name;
			this.email = this.user.email;
			this.color = this.user.color;
			this.lang = this.user.lang;
			this.theme = this.user.theme;
		},
		async onImageSelect(event) {
			const formData = new FormData();
			const file = event.files[0];
			formData.append('member-image', file);

			try {
				this.user.imageUrl = await uploadMemberImage(this.token, this.user.id, formData);
			} catch {
				this.errorMessage = "Échec lors de la modification."
			}
		},
		async deleteUserImage() {
			try {
				await deleteUserImage(this.token, this.user.id);
				this.user.imageUrl = '';
				this.success = true;
				this.$refs.toast.add({
					severity: 'success',
					summary: 'Succès',
					detail: 'Image supprimée avec succès',
					life: 3000
				});
			} catch {
				this.errorMessage = "Échec lors de la suppression.";
			}
		},
		async submitUpdateUser() {
			this.errorMessage = "";
			this.success = false;
			const {error} = userSchema.validate({name: this.name, email: this.email});
			if (error) {
				this.errorMessage = error.message;
				return
			}

			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}
			const userInformations = {
				name: this.name,
				email: this.email,
				color: this.color,
				lang: this.lang,
				theme: this.theme
			}
			try {
				await updateUser(this.token, userInformations);
				this.user.name = this.name;
				this.user.email = this.email;
				this.success = true;
				this.$refs.toast.add({
					severity: 'success',
					summary: 'Succès',
					detail: 'Les informations sont modifiées',
					life: 3000
				});
			} catch {
				this.errorMessage = "Échec lors de la modification.";
			}
		}
	},
	created() {
		this.initializeUserData();
	}
};
</script>

<style scoped>
.custom-color-picker {
	--p-colorpicker-preview-width: 42px;
	--p-colorpicker-preview-height: 42px;
}
</style>