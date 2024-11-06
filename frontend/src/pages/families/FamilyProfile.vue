<template>
    <div v-if="family" class="flex justify-center items-center p-10">
        <div class="w-96 gap-3 flex flex-col">
            <h1 class="text-3xl mb-8 text-center">Ma famille</h1>
            <form id="profileForm" class="flex flex-col gap-5 border p-3 rounded-lg"
                @submit.prevent="submitUpdateFamily">
                <div class="flex flex-inline items-center justify-between">
                    <FloatLabel variant="on">
                        <InputText id="name" v-model.trim="name" class="w-60" />
                        <label for="name">Nom</label>
                    </FloatLabel>
                    <ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color" />
                </div>

                <Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

                <Button :disabled="isSubmitButtonDisabled" label="Enregistrer les modifications" raised type="submit" />
            </form>

            <div class="flex items-center justify-between border p-3 rounded-lg">
                <div class="flex flex-col gap-3">
                    <FileUpload auto chooseLabel="Choisir une image" class="p-button-outlined" customUpload mode="basic"
                        severity="secondary" @select="onImageSelect" />
                    <Button v-if="family.imageUrl" icon="pi pi-minus" label="Supprimer l'image" outlined severity="warn"
                        @click="deleteFamilyImage" />
                </div>
                <img v-if="family.imageUrl" :src="family.imageUrl" alt="Image" class="shadow-md rounded-xl h-24" />
            </div>


            <div class="flex flex-col border p-3 rounded-lg gap-3">
                <h2 class="text-2xl text-center">Membres principaux</h2>
                <div v-for="accountMember in accountMembers" :key="accountMember.id"
                    class="flex flex-inline items-center justify-between border p-3 rounded-lg">
                    <p>{{ accountMember.name }}</p>
                    <span class="w-10 h-4 border rounded-lg" :style="{ backgroundColor: accountMember.color }"></span>
                </div>
                <Button icon="pi pi-user-plus" label="Créer une invitation" @click="createInvitation" />
            </div>
            <div class="flex flex-col border p-3 rounded-lg gap-3">
                <h2 class="text-2xl mb-8 text-center">Membres secondaires</h2>
                <div v-for="guestMember in guestMembers" :key="guestMember.id"
                    class="flex flex-inline items-center justify-between border p-3 rounded-lg">
                    <p>{{ guestMember.name }}</p>
                    <span class="w-10 h-4 border rounded-lg" :style="{ backgroundColor: guestMember.color }"></span>
                </div>
            </div>
            <Dialog v-model:visible="dialogVisible" header="Code d'invitation">
                <div class="flex flex-col items-center gap-3">
                    <p>{{ inviteCode }}</p>
                    <Button icon="pi pi-copy" label="Copier le code" @click="copyInviteCode" />
                </div>
            </Dialog>

            <Toast ref="toast" position="bottom-right" />
        </div>
    </div>
</template>

<script>
import { updateFamily } from "@/services/familyServices.js";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { familySchema } from "@/schemas/familySchemas.js";
import { deleteFamilyImage, uploadFamilyImage } from "@/services/familyServices.js";
import Dialog from 'primevue/dialog';
import { createInvitationCode } from "@/services/familyServices.js";
import { getAllMembersByFamilyId } from "@/services/memberServices.js";

export default {
    inject: ['family', 'token'],
    components: {
        InputText, Button, Message, FloatLabel, ColorPicker, FileUpload, Toast, Dialog
    },
    data: () => {
        return {
            name: '',
            color: '',
            familyImageUrl: '',
            errorMessage: "",
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
                    summary: 'Succès',
                    detail: 'Image téléchargé avec succès',
                    life: 3000
                });
            } catch {
                this.errorMessage = "Échec lors de la modification."
            }
        },
        async deleteFamilyImage() {
            try {
                await deleteFamilyImage(this.family.id, this.token);
                this.family.imageUrl = '';
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
        async submitUpdateFamily() {
            this.errorMessage = "";

            if (!this.color.startsWith('#')) {
                this.color = '#' + this.color;
            }

            const { error } = familySchema.validate({ name: this.name, color: this.color });
            if (error) {
                this.errorMessage = error.message;
                return
            }

            const familyInformations = {
                name: this.name,
                color: this.color,
            }
            try {
                await updateFamily(familyInformations, this.token);
                this.family.name = this.name;
                this.family.color = this.color;
                this.$refs.toast.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Les informations sont modifiées',
                    life: 3000
                });
            } catch {
                this.errorMessage = "Échec lors de la modification.";
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
                console.log('Code d\'invitation copié dans le presse-papiers');
            }).catch(err => {
                console.error('Erreur lors de la copie du code:', err);
            });
        },
        async getAllFamilyMembers() {
            try {
                const familyMembers = await getAllMembersByFamilyId(this.token);
                this.accountMembers = familyMembers.accountMembers;
                this.guestMembers = familyMembers.guestMembers;
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