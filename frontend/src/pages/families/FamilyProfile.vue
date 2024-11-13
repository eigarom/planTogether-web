<template>
    <div v-if="family" class="top-20 w-96 gap-3 flex flex-col pt-20 pb-16">
        <h1 class="text-3xl mb-4 text-center">{{ $t('myFamily') }}</h1>
        <form id="profileForm" class="flex flex-col gap-5 border p-3 rounded-lg" @submit.prevent="submitUpdateFamily">
            <div class="flex flex-inline items-center justify-between">
                <FloatLabel variant="on">
                    <InputText id="name" v-model.trim="name" class="w-60" />
                    <label for="name">{{ $t('familyName') }}</label>
                </FloatLabel>
                <ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color" />
            </div>

            <Button :disabled="isSubmitButtonDisabled" :label="$t('saveModifications')" raised type="submit" />
        </form>

        <Button :label="$t('quitFamily')" raised severity="danger" @click="submitQuitFamily" />

        <div class="flex items-center justify-between border p-3 rounded-lg">
            <div class="flex flex-col gap-3">
                <FileUpload auto :chooseLabel="$t('updateImageButton')" class="p-button-outlined" customUpload
                    mode="basic" severity="secondary" @select="onImageSelect" />
                <Button v-if="family.imageUrl" icon="pi pi-minus" :label="$t('deleteImageButton')" outlined
                    severity="warn" @click="deleteFamilyImage" />
            </div>
            <img v-if="family.imageUrl" :src="family.imageUrl" alt="Image" class="shadow-md rounded-xl h-24" />
        </div>


        <div class="flex flex-col border p-3 rounded-lg gap-3">
            <h2 class="text-2xl text-center">{{ $t('accountMembers') }}</h2>
            <router-link v-for="accountMember in accountMembers" :key="accountMember.id"
                :to="accountMember.id === user.id ? '/profile' : `/members/${accountMember.id}`"
                class="flex flex-inline items-center justify-between border p-3 rounded-lg">
                <p>{{ accountMember.name }}</p>
                <Avatar v-if="accountMember.imageUrl" :image="accountMember.imageUrl" shape="circle" size="small"
                    class="border-4" :style="{ borderColor: accountMember.color }" />
                <Avatar v-else :label="accountMember.name[0].toUpperCase()"
                    :style="`background-color: ${accountMember.color}`" class="font-semibold text-white" shape="circle"
                    size="small" />
            </router-link>
            <Button icon="pi pi-user-plus" :label="$t('inviteCode')" @click="createInvitation" />
        </div>
        <div class="flex flex-col border p-3 rounded-lg gap-3">
            <h2 class="text-2xl text-center">{{ $t('guestMembers') }}</h2>
            <router-link v-for="guestMember in guestMembers" :key="guestMember.id" :to="`/members/${guestMember.id}`"
                class="flex flex-inline items-center justify-between border p-3 rounded-lg">
                <p>{{ guestMember.name }}</p>
                <Avatar v-if="guestMember.imageUrl" :image="guestMember.imageUrl" shape="circle" size="small"
                    class="border-4" :style="{ borderColor: guestMember.color }" />
                <Avatar v-else :label="guestMember.name[0].toUpperCase()"
                    :style="`background-color: ${guestMember.color}`" class="font-semibold text-white" shape="circle"
                    size="small" />
            </router-link>
            <Button icon="pi pi-user-plus" :label="$t('addMember')" @click="navigateToAddMember" />
        </div>
        <Dialog v-model:visible="dialogVisible" :header="$t('inviteCode')">
            <div class="flex flex-col items-center gap-3">
                <p>{{ inviteCode }}</p>
                <Button icon="pi pi-copy" :label="$t('pasteCode')" @click="copyInviteCode" />
            </div>
        </Dialog>

        <Toast ref="toast" position="bottom-right" />
    </div>
</template>

<script>
import { createInvitationCode, deleteFamilyImage, updateFamily, uploadFamilyImage, quitFamily } from "@/services/familyServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { familySchema } from "@/schemas/familySchemas.js";
import Dialog from 'primevue/dialog';
import { getAllMembersByFamilyId, getMemberImage } from "@/services/memberServices.js";
import Avatar from "primevue/avatar";

export default {
    inject: ['user', 'family', 'token'],
    components: {
        InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, Dialog, Avatar
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
        async submitQuitFamily() {
            try {
                const result = await quitFamily(this.token);
                this.$cookies.set("jwtToken", result.token);
                window.location.href = '/';
            } catch {
                this.$refs.toast.add({
                    severity: 'error',
                    summary: this.$t('toastErrorTitle'),
                    detail: this.$t('errorUpdateMessage'),
                    life: 5000
                });
            }
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