<template>
    <div v-if="member" class="flex flex-col gap-3 w-80 pt-20">
        <h1 class="text-3xl mb-4 text-center">{{ $t('memberTitle') }}</h1>
        <form id="memberProfileForm" class="flex flex-col gap-5 border p-3 rounded-lg"
            @submit.prevent="submitUpdateMember">
            <div class="flex items-center justify-between">
                <FloatLabel variant="on">
                    <InputText id="name" v-model.trim="name" class="w-60" />
                    <label for="name">{{ $t('memberName') }}</label>
                </FloatLabel>
                <ColorPicker v-model="color" class="custom-color-picker" format="hex" inputId="color" />
            </div>

            <Button :disabled="isSubmitButtonDisabled" :label="$t('updateButton')" raised type="submit" />
        </form>

        <div class="flex items-center justify-between border p-3 rounded-lg">
            <div class="flex flex-col gap-3">
                <FileUpload :chooseLabel="$t('updateImageButton')" auto class="p-button-outlined" customUpload
                    mode="basic" severity="secondary" @select="onImageSelect" />
                <Button v-if="member.imageUrl" :label="$t('deleteImageButton')" icon="pi pi-minus" outlined
                    severity="warn" @click="submitDeleteMemberImage" />
            </div>
            <img v-if="member.imageUrl" :src="member.imageUrl" alt="Image" class="shadow-md rounded-xl h-24" />
        </div>
        <ConfirmDialog></ConfirmDialog>
        <Toast ref="toast" position="bottom-right" />
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
import { memberSchema } from "@/schemas/memberSchemas.js";
import { getMemberById, getMemberImage, updateMemberById, deleteMemberImage, uploadMemberImage } from "@/services/memberServices.js";

export default {
    inject: ['token'],
    components: {
        InputText, Button, FloatLabel, ColorPicker, FileUpload, Toast, ConfirmDialog
    },
    props: {
        id: String
    },
    data: () => {
        return {
            name: '',
            color: '',
            imageUrl: '',
            member: null
        };
    },
    computed: {
        isSubmitButtonDisabled() {
            return this.name === this.member.name && this.color === this.member.color;
        }
    },
    methods: {
        async getMemberInformations(id) {
            const token = this.$cookies.get('jwtToken');
            if (token) {
                const formData = new FormData();
                try {
                    this.member = await getMemberById(token, id);
                    this.name = this.member.name;
                    this.color = this.member.color;
                    this.member.imageUrl = await getMemberImage(this.token, this.id, formData);
                } catch {
                    this.$refs.toast.add({
                        severity: 'error',
                        summary: this.$t('toastErrorTitle'),
                        detail: this.$t('errorGetMessage'),
                        life: 5000
                    });
                }
            }
        },
        async onImageSelect(event) {
            const formData = new FormData();
            const file = event.files[0];
            formData.append('member-image', file);

            try {
                this.member.imageUrl = await uploadMemberImage(this.token, this.id, formData);
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
                this.member.imageUrl = '';
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
            this.errorMessage = "";

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
                this.member.id = this.id;
                this.member.name = this.name;
                this.member.color = this.color;
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
</style>