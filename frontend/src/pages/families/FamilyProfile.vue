<template>
	<div v-if="family" class="flex flex-col gap-5 w-full">
		<h1 class="text-3xl">{{ $t('myFamily') }}</h1>

		<!--Contenu principal-->
		<div class="flex flex-wrap gap-8 w-full min-w-[500px]">

			<!--Informations de la famille-->
			<div class="flex flex-col gap-8">

				<!--Nom, image, couleur-->
				<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg">
					<!--Image-->
					<div class="flex items-center gap-8">
						<img v-if="family.imageUrl" :src="family.imageUrl" alt="Image"
							 class="shadow-md rounded-xl w-40"/>
						<span v-else class="border-dashed border-2 rounded-xl h-24 w-40 bg-gray-100"></span>

						<div class="flex flex-wrap gap-8">
							<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined w-48"
										customUpload
										mode="basic" severity="secondary" @select="onImageSelect"/>
							<Button :label="$t('deleteImageButton')" class="w-48" icon="pi pi-minus"
									outlined severity="warn" @click="deleteFamilyImage"/>
						</div>
					</div>

					<!--Nom, couleur-->
					<form id="profileForm" class="flex flex-wrap items-center gap-8"
						  @submit.prevent="submitUpdateFamily">
						<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>

						<FloatLabel class="flex-grow" variant="on">
							<InputText id="name" v-model.trim="name" class="w-full"/>
							<label for="name">{{ $t('familyName') }}</label>
						</FloatLabel>

						<Button :disabled="isSubmitButtonDisabled" :label="$t('saveModifications')" class="w-40" raised
								type="submit"/>
					</form>
				</div>

				<!--Membres de la famille-->
				<div class="flex flex-wrap gap-8 justify-between">

					<!--Membres principaux-->
					<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg w-[310px]">
						<h2 class="text-2xl text-center">{{ $t('accountMembers') }}</h2>
						<router-link v-for="accountMember in accountMembers" :key="accountMember.id"
									 :to="accountMember.id === user.id ? '/profile' : `/members/${accountMember.id}`"
									 class="flex flex-inline items-center justify-between border p-3 rounded-lg">
							<p>{{ accountMember.name }}</p>
							<Avatar v-if="accountMember.imageUrl" :image="accountMember.imageUrl"
									:style="{ borderColor: accountMember.color }" class="border-4"
									shape="circle" size="small"/>
							<Avatar v-else :label="accountMember.name[0].toUpperCase()"
									:style="`background-color: ${accountMember.color}`" class="font-semibold text-white"
									shape="circle"
									size="small"/>
						</router-link>
						<Button :label="$t('inviteCode')" icon="pi pi-user-plus" @click="createInvitation"/>
					</div>

					<!--Membres secondaires-->
					<div class="flex flex-col p-5 gap-8 bg-white border rounded-lg w-[310px]">
						<h2 class="text-2xl text-center">{{ $t('guestMembers') }}</h2>
						<router-link v-for="guestMember in guestMembers" :key="guestMember.id"
									 :to="`/members/${guestMember.id}`"
									 class="flex flex-inline items-center justify-between border p-3 rounded-lg">
							<p>{{ guestMember.name }}</p>
							<Avatar v-if="guestMember.imageUrl" :image="guestMember.imageUrl"
									:style="{ borderColor: guestMember.color }" class="border-4"
									shape="circle" size="small"/>
							<Avatar v-else :label="guestMember.name[0].toUpperCase()"
									:style="`background-color: ${guestMember.color}`" class="font-semibold text-white"
									shape="circle"
									size="small"/>
						</router-link>
						<Button :label="$t('addMember')" icon="pi pi-user-plus" @click="navigateToAddMember"/>
					</div>
				</div>
			</div>

			<!--Boutons pour quitter et supprimer la famille-->
			<div class="flex flex-col gap-8 bg-white border rounded-lg h-fit p-5">
				<Button :label="$t('quitFamily')" outlined raised severity="danger"
						@click="submitQuitFamily($event)"/>
				<Button :label="$t('deleteFamilyButton')" raised severity="danger"
						@click="submitDeleteFamily($event)"/>
			</div>
		</div>

		<Dialog v-model:visible="dialogVisible" :header="$t('inviteCode')">
			<div class="flex flex-col items-center gap-3">
				<p>{{ inviteCode }}</p>
				<Button :label="$t('pasteCode')" icon="pi pi-copy" @click="copyInviteCode"/>
			</div>
		</Dialog>
		<ConfirmDialog></ConfirmDialog>
		<Toast ref="toast" position="bottom-right"/>
	</div>
</template>

<script>
import {
	createInvitationCode,
	deleteFamily,
	deleteFamilyImage,
	quitFamily,
	updateFamily,
	uploadFamilyImage
} from "@/services/familyServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import {familySchema} from "@/schemas/familySchemas.js";
import Dialog from 'primevue/dialog';
import {getAllMembersByFamilyId, getMemberImage} from "@/services/memberServices.js";
import Avatar from "primevue/avatar";
import ConfirmDialog from 'primevue/confirmdialog';

export default {
	inject: ['user', 'family', 'token'],
	components: {
		InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, Dialog, Avatar, ConfirmDialog
	},
	data: () => {
		return {
			name: '',
			color: '',
			familyImageUrl: '',
			dialogVisible: false,
			inviteCode: '',
			accountMembers: [],
			guestMembers: []
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return this.name === this.family.name && this.color === this.family.color;
		}
	},
	methods: {
		initializeFamilyData() {
			this.name = this.family.name;
			this.color = this.family.color;
		},
		async onImageSelect(event) {
			const formData = new FormData();
			const file = event.files[0];
			formData.append('family-image', file);

			try {
				this.family.imageUrl = await uploadFamilyImage(this.family.id, this.token, formData);
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
		async deleteFamilyImage() {
			try {
				await deleteFamilyImage(this.family.id, this.token);
				this.family.imageUrl = '';
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
		async submitUpdateFamily() {

			if (!this.color.startsWith('#')) {
				this.color = '#' + this.color;
			}

			const familyInformations = {
				name: this.name,
				color: this.color,
			}
			try {
				await familySchema.validate(familyInformations);
				await updateFamily(familyInformations, this.token);
				this.family.name = this.name;
				this.family.color = this.color;
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
		async submitQuitFamily(event) {
			this.$confirm.require({
				target: event.currentTarget,
				message: this.$t('quitFamilyConfirm'),
				icon: 'pi pi-info-circle',
				rejectProps: {
					label: this.$t('cancelButton'),
					severity: 'secondary',
					outlined: true
				},
				acceptProps: {
					label: this.$t('quitButton'),
					severity: 'danger'
				},
				accept: async () => {
					try {
						const result = await quitFamily(this.token, this.id);
						this.$cookies.set("jwtToken", result.token);
						window.location.href = '/';
					} catch {
						this.$refs.toast.add({
							severity: 'error',
							summary: this.$t('toastErrorTitle'),
							detail: this.$t('toastErrorQuitFamily'),
							life: 5000
						});
					}
				}
			});
		},
		async submitDeleteFamily(event) {
			this.$confirm.require({
				target: event.currentTarget,
				message: this.$t('deleteFamilyConfirm'),
				icon: 'pi pi-info-circle',
				rejectProps: {
					label: this.$t('cancelButton'),
					severity: 'secondary',
					outlined: true
				},
				acceptProps: {
					label: this.$t('deleteFamilyButton'),
					severity: 'danger'
				},
				accept: async () => {
					try {
						const result = await deleteFamily(this.token, this.id);
						this.$cookies.set("jwtToken", result.token);
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
		},
		async createInvitation() {
			try {
				const response = await createInvitationCode(this.token);
				this.inviteCode = response.inviteCode;
				this.dialogVisible = true;
			} catch (error) {
				console.error('Erreur:', error);
			}
		},
		copyInviteCode() {
			navigator.clipboard.writeText(this.inviteCode).then(() => {
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastCopiedMessage'),
					life: 3000
				});
			}).catch(() => {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('errorUpdateMessage'),
					life: 5000
				});
			});
		},
		navigateToAddMember() {
			this.$router.push('/members/add');
		},
		sortMembersAlphabetically(members) {
			return members.sort((a, b) => a.name.localeCompare(b.name));
		},
		async getAllFamilyMembers() {
			try {
				const familyMembers = await getAllMembersByFamilyId(this.token);
				this.accountMembers = this.sortMembersAlphabetically(familyMembers.accountMembers);
				for (const accountMember of this.accountMembers) {
					accountMember.imageUrl = await getMemberImage(this.token, accountMember.id);
				}
				this.guestMembers = this.sortMembersAlphabetically(familyMembers.guestMembers);
				for (const guestMember of this.guestMembers) {
					guestMember.imageUrl = await getMemberImage(this.token, guestMember.id);
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		}
	},
	created() {
		this.initializeFamilyData();
		this.getAllFamilyMembers();
	}
};
</script>

<style scoped>
.custom-color-picker {
	--p-colorpicker-preview-width: 42px;
	--p-colorpicker-preview-height: 42px;
}
</style>