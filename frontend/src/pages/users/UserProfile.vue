<template>
	<div v-if="user" class="flex flex-col gap-3 w-full p-5 sm:p-0">
		<h1 class="text-2xl">{{ $t('userTitle') }}</h1>

		<!--Contenu principal-->
		<div class="flex flex-col gap-8 p-5 bg-white border rounded-lg w-full sm:w-[565px]">

			<!--Image de l'utilisateur-->
			<div class="flex sm:gap-8 justify-between items-center">

				<!--Image-->
				<Avatar
					:image="user.imageUrl || null"
					:label="!user.imageUrl ? userInitial : ''"
					:style="!user.imageUrl ? `background-color: ${user.color}` : ''"
					alt="Image"
					class="custom-avatar font-semibold text-white flex-shrink-0"
					shape="circle"
				/>

				<!--Boutons-->
				<div class="flex flex-col sm:flex-row gap-5 sm:gap-8">
					<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined w-[180px]"
								customUpload
								mode="basic" severity="secondary" @select="onImageSelect"/>

					<Button :disabled="isDeleteImageButtonDisabled" :label="$t('deleteImageButton')"
							class="w-[180px]" icon="pi pi-minus"
							outlined severity="warn" @click="deleteUserImage"/>
				</div>
			</div>

			<!--Nom, courriel, couleur-->
			<form id="userProfileForm" class="flex flex-col gap-8 w-full" @submit.prevent="submitUpdateUser">

				<!--Inputs-->
				<div class="flex flex-col sm:flex-row gap-8">
					<div class="inline-flex gap-5 sm:gap-8">
						<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>

						<FloatLabel class="flex-grow" variant="on">
							<InputText id="name" v-model.trim="name" class="w-full"/>
							<label for="name">{{ $t('memberName') }}</label>
						</FloatLabel>
					</div>

					<FloatLabel class="flex-grow" variant="on">
						<InputText id="email" v-model.trim="email" class="w-full"/>
						<label for="email">{{ $t('email') }}</label>
					</FloatLabel>
				</div>

				<!--Boutons de modification et suppression du compte-->
				<div class="flex gap-8 justify-between sm:justify-center">
					<Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" class="w-32"
							type="submit"/>
					<Button :label="$t('deleteButton')" class="w-32" severity="danger"
							@click="confirm($event)"/>
				</div>
			</form>
		</div>


		<ConfirmDialog class="m-5"></ConfirmDialog>
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
	inject: ['user', 'token', 'family', 'isDesktop'],
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
		isDeleteImageButtonDisabled() {
			return !this.user.imageUrl;
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
				this.family.accountMembers.find(member => member.id === parseInt(this.user.id)).imageUrl =
					this.user.imageUrl;

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
				header: this.$t('deleteAccount'),
				message: this.$t('deleteAccountConfirm'),
				icon: 'pi pi-exclamation-triangle',
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