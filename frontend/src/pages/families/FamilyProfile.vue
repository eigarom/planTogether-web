<template>
	<div v-if="family" class="flex flex-col gap-5">
		<h1 class="text-3xl">{{ $t('myFamily') }}</h1>

		<!--Contenu principal-->
		<div class="flex flex-wrap gap-8 w-fit">

			<!--Informations de la famille-->
			<div class="flex flex-col gap-8">

				<!--Nom, image, couleur-->
				<div class="flex flex-col gap-8 bg-white p-5 border rounded-lg w-fit">
					<!--Image-->
					<div class="flex items-center gap-8">
						<img v-if="family.imageUrl" :src="family.imageUrl" alt="Image"
							 class="shadow-md rounded-xl w-40"/>

						<span v-else class="border-dashed border-2 rounded-xl h-24 w-40 bg-gray-100"></span>

						<div class="flex flex-wrap gap-8">
							<FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined w-[180px]"
										customUpload mode="basic"
										raised severity="secondary" @select="onImageSelect"/>

							<Button :disabled="isDeleteImageButtonDisabled" :label="$t('deleteImageButton')"
									class="w-[180px]" icon="pi pi-minus"
									outlined severity="warn"
									@click="deleteFamilyImage"/>
						</div>
					</div>

					<!--Nom, couleur-->
					<form id="profileForm" class="flex flex-wrap items-center gap-8 w-full"
						  @submit.prevent="submitUpdateFamily">

						<ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color"/>

						<FloatLabel class="flex-grow" variant="on">
							<InputText id="name" v-model.trim="name" class="w-full"/>
							<label for="name">{{ $t('familyName') }}</label>
						</FloatLabel>

						<Button :disabled="isSubmitButtonDisabled" :label="$t('saveModifications')" class="w-40"
								type="submit"/>
					</form>
				</div>

				<!--Membres de la famille-->
				<div class="flex flex-wrap gap-8 justify-between">

					<!--Membres principaux-->
					<div class="flex flex-col flex-grow gap-5 bg-white p-5 border rounded-lg">
						<h2 class="text-2xl text-center">{{ $t('accountMembers') }}</h2>

						<div>
							<!--Utilisateur-->
							<router-link :to="'/profile'">
								<div class="flex flex-inline items-center justify-between  p-3 rounded-lg
									 hover:bg-slate-100 h-fit"
								>

									<p>{{ user.name }}</p>

									<Avatar v-if="user.imageUrl" :image="user.imageUrl"
											:style="{ borderColor: user.color }" class="border-4"
											shape="circle" size="small"/>
									<Avatar v-else :label="user.name[0].toUpperCase()"
											:style="`background-color: ${user.color}`"
											class="font-semibold text-white"
											shape="circle"
											size="small"/>
								</div>
							</router-link>

							<!--Autres membres principaux-->
							<router-link v-for="accountMember in accountMembers" :key="accountMember.id"
										 :to="`/members/${accountMember.id}`">
								<div v-if="accountMember.id !== user.id"
									 class="flex flex-inline items-center justify-between  p-3 rounded-lg hover:bg-slate-100 h-fit"
								>
									<p>{{ accountMember.name }}</p>

									<Avatar v-if="accountMember.imageUrl" :image="accountMember.imageUrl"
											:style="{ borderColor: accountMember.color }" class="border-4"
											shape="circle" size="small"
									/>
									<Avatar v-else :label="accountMember.name[0].toUpperCase()"
											:style="`background-color: ${accountMember.color}`"
											class="font-semibold text-white"
											shape="circle"
											size="small"
									/>
								</div>
							</router-link>
						</div>

						<Button :label="$t('inviteCode')" icon="pi pi-user-plus" @click="createInvitation"/>
					</div>

					<!--Membres secondaires-->
					<div class="flex flex-col flex-grow p-5 gap-5 bg-white border rounded-lg  h-fit">
						<h2 class="text-2xl text-center">{{ $t('guestMembers') }}</h2>

						<div v-if="guestMembers.length > 0">
							<router-link v-for="guestMember in guestMembers" :key="guestMember.id"
										 :to="`/members/${guestMember.id}`"
										 class="flex flex-inline items-center justify-between p-3 rounded-lg hover:bg-slate-100"
							>
								<p>{{ guestMember.name }}</p>

								<Avatar v-if="guestMember.imageUrl" :image="guestMember.imageUrl"
										:style="{ borderColor: guestMember.color }" class="border-4"
										shape="circle" size="small"
								/>
								<Avatar v-else :label="guestMember.name[0].toUpperCase()"
										:style="`background-color: ${guestMember.color}`"
										class="font-semibold text-white" shape="circle" size="small"
								/>
							</router-link>
						</div>

						<Button :label="$t('addMember')" icon="pi pi-user-plus" @click="addMember"/>
					</div>
				</div>
			</div>

			<!--Boutons pour quitter et supprimer la famille-->
			<div class="flex flex-col gap-8 bg-white border rounded-lg h-fit p-5">
				<Button :label="$t('quitFamily')" outlined severity="danger"
						@click="submitQuitFamily($event)"/>
				<Button :label="$t('deleteFamilyButton')" severity="danger"
						@click="submitDeleteFamily($event)"/>
			</div>
		</div>

		<!--Créer code d'invitation-->
		<Dialog v-model:visible="dialogInvitationCodeVisible" :header="$t('inviteCode')" modal>
			<div class="flex flex-col items-center gap-3">
				<p>{{ inviteCode }}</p>
				<Button :label="$t('pasteCode')" icon="pi pi-copy" @click="copyInviteCode"/>
			</div>
		</Dialog>

		<!--Créer un membre-->
		<Dialog v-model:visible="dialogMemberCreationVisible" :header="$t('addMemberTitle')" modal>
			<form id="profileForm" class="flex flex-col gap-8" @submit.prevent="submitCreateMember">
				<div class="flex flex-inline gap-8 mt-2">
					<FloatLabel variant="on">
						<InputText id="name" v-model.trim="newMemberName" class="w-60"/>
						<label for="name">{{ $t('memberName') }}</label>
					</FloatLabel>

					<ColorPicker v-model="newMemberColor" class="custom-color-picker" format="hex" inputId="color"/>
				</div>

				<Button :disabled="isAddMemberSubmitButtonDisabled" :label="$t('submitButton')" raised type="submit"/>
			</form>
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
import {createMember} from "@/services/memberServices.js";
import Avatar from "primevue/avatar";
import ConfirmDialog from 'primevue/confirmdialog';
import {memberSchema} from "@/schemas/memberSchemas.js";

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
			dialogInvitationCodeVisible: false,
			dialogMemberCreationVisible: false,
			inviteCode: '',
			newMemberName: '',
			newMemberColor: 'FF0000',
			accountMembers: [],
			guestMembers: []
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return this.name === this.family.name && this.color === this.family.color;
		},
		isAddMemberSubmitButtonDisabled() {
			return !this.newMemberName;
		},
		isDeleteImageButtonDisabled() {
			return !this.family.imageUrl;
		}
	},
	methods: {
		initializeFamilyData() {
			this.name = this.family.name;
			this.color = this.family.color;
			this.familyImageUrl = this.family.imageUrl;
			this.accountMembers = this.family.accountMembers;
			this.guestMembers = this.family.guestMembers;
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
				header: this.$t('quitFamily'),
				message: this.$t('quitFamilyConfirm'),
				icon: 'pi pi-exclamation-triangle',
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
				header: this.$t('deleteFamilyButton'),
				message: this.$t('deleteFamilyConfirm'),
				icon: 'pi pi-exclamation-triangle',
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
				this.dialogInvitationCodeVisible = true;
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
		addMember() {
			this.dialogMemberCreationVisible = true;
		},
		async submitCreateMember() {
			if (!this.newMemberColor.startsWith('#')) {
				this.newMemberColor = '#' + this.newMemberColor;
			}

			const memberInformations = {
				name: this.newMemberName,
				color: this.newMemberColor
			}

			try {
				await memberSchema.validate(memberInformations);
				const newMember = await createMember(memberInformations, this.token);
				this.guestMembers.push(newMember);
				this.guestMembers = this.sortMembersAlphabetically(this.guestMembers);
				this.family.guestMembers = this.guestMembers;
				this.newMemberName = '';
				this.newMemberColor = 'FF0000';
				this.dialogMemberCreationVisible = false;
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('createMemberSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('createMemberErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		sortMembersAlphabetically(members) {
			return members.sort((a, b) => a.name.localeCompare(b.name));
		}
	},
	created() {
		this.initializeFamilyData();
	}
};
</script>

<style scoped>
.custom-color-picker {
	--p-colorpicker-preview-width: 42px;
	--p-colorpicker-preview-height: 42px;
}
</style>