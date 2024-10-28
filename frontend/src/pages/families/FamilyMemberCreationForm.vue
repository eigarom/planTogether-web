<template>
    <FloatingTitle />

    <div class="flex h-full justify-center items-center">
        <div class="w-80">
            <h1 class="text-3xl mb-8 text-center font-medium">Créer un membre</h1>
            <form id="familymembercreationForm" class="flex flex-col gap-5" @submit.prevent="submitCreateFamilyMember">

                <FloatLabel variant="on">
                    <InputText id="name" v-model.trim="name" class="w-full" />
                    <label for="name">Nom</label>
                </FloatLabel>

                <div class="flex justify-between px-3">
                    <label class="font-medium" for="color">Couleur du membre</label>
                    <ColorPicker v-model="color" format="hex" inputId="color" />
                </div>

                <Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

                <Button :disabled="isCreateFamilyMemberDisabled" label="Confirmer" raised type="submit" />
            </form>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import ColorPicker from 'primevue/colorpicker';
import { createFamilyMember } from "@/services/familyMemberServices.js";
import { createFamilyMemberSchema } from "@/schemas/familyMemberSchemas.js";
import FloatingTitle from "@/components/FloatingTitle.vue";

export default {
    components: {
        FloatingTitle, InputText, Button, Message, FloatLabel, ColorPicker
    },
    data: () => {
        return {
            name: "",
            color: "#358be6",
            errorMessage: ""
        };
    },
    computed: {
        isCreateFamilyMemberDisabled() {
            return !this.name
        }
    },
    methods: {
        async submitCreateFamilyMember() {
            this.errorMessage = "";
            const familyMemberInformations = {
                name: this.name
            }
            const { error } = createFamilyMemberSchema.validate(familyMemberInformations);
            if (error) {
                this.errorMessage = error.message;
                return
            }
            const newFamilyMember = {
                name: this.name,
                color: "#" + this.color,
                imageContent: "",
                imageContentType: ""
            }
            try {
                const token = this.$cookies.get('jwtToken');
                await createFamilyMember(newFamilyMember, token);
                window.location.href = '/';
            } catch (err) {
                this.errorMessage = "Échec de la création du membre.";
                console.error("An error occurred:", err);
            }
        }
    }
};
</script>