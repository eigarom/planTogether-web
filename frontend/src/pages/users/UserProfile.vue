<template>
	<div v-if="user" class="flex flex-col w-full">
		<h1 class="text-3xl mb-10">{{ $t('userTitle') }}</h1>
		<div class="flex flex-col gap-8">
			<div class="flex gap-8">
				<Avatar v-if="user.imageUrl" :image="user.imageUrl" alt="Image" class="custom-avatar" shape="circle"/>
				<Avatar v-else :label="userInitial" :style="`background-color: ${user.color}`"
						class="custom-avatar font-semibold text-white" shape="circle" size=""/>
				<div class="flex gap-8 items-center">
					<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined" customUpload
								mode="basic" severity="secondary" @select="onImageSelect"/>
					<Button :label="$t('deleteImageButton')" icon="pi pi-minus" outlined
							severity="warn" @click="deleteUserImage"/>
				</div>
			</div>

			<form id="userProfileForm" class="flex flex-col gap-8"
				  @submit.prevent="submitUpdateUser">
				<div class="flex gap-8 w-full">
					<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>
					<FloatLabel class="w-full" variant="on">
						<InputText id="name" v-model.trim="name" class="w-full"/>
						<label for="name">{{ $t('memberName') }}</label>
					</FloatLabel>

					<FloatLabel class="w-full" variant="on">
						<InputText id="email" v-model.trim="email" class="w-full"/>
						<label for="email">{{ $t('email') }}</label>
					</FloatLabel>
				</div>
				<div class="flex gap-8 justify-end">
					<Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" class="w-32" raised
							type="submit"/>
					<Button :label="$t('deleteButton')" class="w-32" raised severity="danger"
							@click="confirm($event)"/>
				</div>
			</form>
		</div>

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
import Avatar from "primevue/avatar";

export default {
	inject: ['user', 'token'],
	components: {
		Avatar, InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, ConfirmDialog
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
		},
		userInitial() {
			return this.user.name.charAt(0).toUpperCase();
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

.custom-avatar {
	--p-avatar-width: 100px;
	--p-avatar-height: 100px;
	--p-avatar-font-size: 2rem;
}
</style>