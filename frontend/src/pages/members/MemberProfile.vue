<template>
	<div v-if="name" class="flex flex-col w-full gap-5">
		<h1 class="text-3xl">{{ $t('memberTitle') }}</h1>

		<!--Contenu principal-->
		<div class="flex flex-col gap-8 p-5 w-[565px] bg-white border rounded-lg">

			<!--Image de l'utilisateur-->
			<div class="flex gap-8 items-center">

				<!--Image-->
				<div class="w-fit">
					<Avatar v-if="imageUrl" :image="imageUrl" alt="Image" class="custom-avatar"
							shape="circle"/>
					<Avatar v-else :label="memberInitial" :style="`background-color: ${color}`"
							class="custom-avatar font-semibold text-white" shape="circle"/>
				</div>

				<!--Boutons-->
				<div class="flex flex-wrap gap-8">
					<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined" customUpload
								mode="basic" severity="secondary" @select="onImageSelect"/>
					<Button :disabled="isDeleteImageButtonDisabled" :label="$t('deleteImageButton')" icon="pi pi-minus"
							outlined
							severity="warn" @click="submitDeleteMemberImage"/>
				</div>
			</div>

			<!--Nom, courriel, couleur-->
			<form id="memberProfileForm" class="flex flex-col gap-8 w-full" @submit.prevent="submitUpdateMember">

				<!--Inputs-->
				<div class="flex gap-8">
					<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>

					<FloatLabel class="w-full" variant="on">
						<InputText id="name" v-model.trim="name" class="w-full"/>
						<label for="name">{{ $t('memberName') }}</label>
					</FloatLabel>
				</div>


				<!--Boutons de modification et suppression du compte-->
				<div class="flex gap-8 justify-end">
					<Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" class="w-32"
							type="submit"/>
					<Button v-if="isGuestMember" :label="$t('deleteButton')" class="w-32" severity="danger"
							@click="confirm($event)"/>
				</div>

			</form>

			<ConfirmDialog></ConfirmDialog>
			<Toast ref="toast" position="bottom-right"/>
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import {memberSchema} from "@/schemas/memberSchemas.js";
import {deleteMember, deleteMemberImage, updateMemberById, uploadMemberImage} from "@/services/memberServices.js";
import Avatar from "primevue/avatar";

export default {
	inject: ['token', 'family'],
	components: {
		Avatar, InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, ConfirmDialog
	},
	props: {
		id: String
	},
	data: () => {
		return {
			name: '',
			color: '',
			initialName: '',
			initialColor: '',
			imageUrl: '',
			isGuestMember: false
		};
	},
	computed: {
		memberInitial() {
			return this.name.charAt(0).toUpperCase();
		},
		isSubmitButtonDisabled() {
			return this.name === this.initialName && this.color === this.initialColor;
		},
		isDeleteImageButtonDisabled() {
			return !this.imageUrl;
		},
	},
	methods: {
		async getMemberInformations(id) {
			const member = this.family.guestMembers.find(member => member.id === parseInt(id));
			this.name = member.name;
			this.color = member.color;
			this.initialName = member.name;
			this.initialColor = member.color;
			this.imageUrl = member.imageUrl;
		},
		async onImageSelect(event) {
			const formData = new FormData();
			const file = event.files[0];
			formData.append('member-image', file);

			try {
				this.imageUrl = await uploadMemberImage(this.token, this.id, formData);
				this.family.guestMembers.find(member => member.id === parseInt(this.id)).imageUrl = this.imageUrl;

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
		async submitDeleteMemberImage() {
			try {
				await deleteMemberImage(this.token, this.id);
				this.imageUrl = '';
				this.family.guestMembers.find(member => member.id === parseInt(this.id)).imageUrl = '';
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
		async submitUpdateMember() {
			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}

			const memberInformations = {
				name: this.name,
				color: this.color
			}
			try {
				await memberSchema.validate(memberInformations);
				await updateMemberById(this.token, memberInformations, this.id);

				this.initialName = this.name;
				this.initialColor = this.color;

				this.family.guestMembers.find(member => member.id === parseInt(this.id)).name = this.name;
				this.family.guestMembers.find(member => member.id === parseInt(this.id)).color = this.color;

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
				header: this.$t('deleteMember'),
				message: this.$t('deleteMemberConfirm'),
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
						await deleteMember(this.token, this.id);
						this.family.guestMembers.splice(this.family.guestMembers.findIndex(member => member.id === parseInt(this.id)), 1);
						this.$router.push('/my-family');
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
		this.getMemberInformations(this.id);
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