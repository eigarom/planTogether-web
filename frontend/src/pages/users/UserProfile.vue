<template>
	<div v-if="user" class="flex flex-col gap-3 w-80 pt-20">
		<h1 class="text-3xl mb-4 text-center">{{ $t('userTitle') }}</h1>
		<form id="userProfileForm" class="flex flex-col gap-5 border p-3 rounded-lg"
			  @submit.prevent="submitUpdateUser">
			<div class="flex items-center justify-between">
				<FloatLabel variant="on">
					<InputText id="name" v-model.trim="name" class="w-60"/>
					<label for="name">{{ $t('memberName') }}</label>
				</FloatLabel>
				<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>
			</div>

			<FloatLabel variant="on">
				<InputText id="email" v-model.trim="email" class="w-full"/>
				<label for="email">{{ $t('email') }}</label>
			</FloatLabel>

			<Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" raised type="submit"/>
		</form>

		<div class="flex items-center justify-between border p-3 rounded-lg">
			<div class="flex flex-col gap-3">
				<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined" customUpload
							mode="basic" severity="secondary" @select="onImageSelect"/>
				<Button v-if="user.imageUrl" :label="$t('deleteImageButton')"
						icon="pi pi-minus"
						outlined severity="warn" @click="deleteUserImage"/>
			</div>
			<img v-if="user.imageUrl" :src="user.imageUrl" alt="Image" class="shadow-md rounded-xl h-24"/>
		</div>

		<Button :label="$t('deleteButton')" raised severity="danger" @click="confirm($event)"/>
		<ConfirmDialog></ConfirmDialog>
		<Toast ref="toast" position="bottom-right"/>
	</div>
</template>

<script>
import {deleteUser, updateUser} from "@/services/userServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import {userSchema} from "@/schemas/userSchemas.js";
import {deleteMemberImage, uploadMemberImage} from "@/services/memberServices.js";

export default {
	inject: ['user', 'token'],
	components: {
		InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, ConfirmDialog
	},
	data: () => {
		return {
			name: '',
			email: '',
			color: '',
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
		},
		async onImageSelect(event) {
			const formData = new FormData();
			const file = event.files[0];
			formData.append('member-image', file);

			try {
				this.user.imageUrl = await uploadMemberImage(this.token, this.user.id, formData);
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastUpdateImageSuccessMessage'),
					life: 3000
				});
			} catch {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('errorUpdateMessage'),
					life: 5000
				});
			}
		},
		async deleteUserImage() {
			try {
				await deleteMemberImage(this.token, this.user.id);
				this.user.imageUrl = '';
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastDeleteImageSuccessMessage'),
					life: 3000
				});
			} catch {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('errorDeleteMessage'),
					life: 5000
				});
			}
		},
		async submitUpdateUser() {
			this.errorMessage = "";

			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}

			const userInformations = {
				name: this.name,
				email: this.email,
				color: this.color
			}
			try {
				await userSchema.validate(userInformations);
				await updateUser(this.token, userInformations);
				this.user.name = this.name;
				this.user.email = this.email;
				this.user.color = this.color;
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastUpdateProfileSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: err.message,
						life: 5000
					});
				} else {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: this.$t('errorUpdateMessage'),
						life: 5000
					});
				}
			}
		},
		async confirm(event) {
			this.$confirm.require({
				target: event.currentTarget,
				message: this.$t('deleteAccountConfirm'),
				icon: 'pi pi-info-circle',
				rejectProps: {
					label: this.$t('cancelButton'),
					severity: 'secondary',
					outlined: true
				},
				acceptProps: {
					label: this.$t('deleteButton'),
					severity: 'danger'
				},
				accept: async () => {
					try {
						await deleteUser(this.token);
						document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
						window.location.href = '/';
					} catch {
						this.$refs.toast.add({
							severity: 'error',
							summary: this.$t('toastErrorTitle'),
							detail: this.$t('errorDeleteMessage'),
							life: 5000
						});
					}
				}
			});
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