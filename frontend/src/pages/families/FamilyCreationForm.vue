<template>
    <div class="flex align-items-center justify-content-center min-h-screen">
        <div class="flex flex-column ">
            <h1 class="align-self-center">Créer une famille</h1>
            <form id="familycreationForm" class="flex flex-column row-gap-3 align-content-center w-20rem"
                @submit.prevent="submitCreateFamily">


                <FloatLabel variant="on">
                    <InputText id="name" v-model.trim="name" class="w-20rem" />
                    <label for="name">Nom</label>
                </FloatLabel>


                <div class="flex justify-content-between">
                    <label for="color">Couleur des événements communs </label>
                    <ColorPicker v-model="color" format="hex" inputId="color" />
                </div>

                <Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>
                <Button :disabled="isCreateFamilyDisabled" label="Confirmer" type="submit" />
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
import { createFamily } from "@/services/familyServices.js";
import { createFamilySchema } from "@/schemas/familySchemas.js";

export default {
    components: {
        InputText, Button, Message, FloatLabel, ColorPicker
    },
    data: () => {
        return {
            name: "",
            color: "#358be6",
            errorMessage: ""
        };
    },
    computed: {
        isCreateFamilyDisabled() {
            return !this.name
        }
    },
    methods: {
        async submitCreateFamily() {
            this.errorMessage = "";
            const familyInformations = {
                name: this.name
            }
            const { error } = createFamilySchema.validate(familyInformations);
            if (error) {
                this.errorMessage = error.message;
                return
            }
            const newFamily = {
                name: this.name,
                color: "#" + this.color,
            }
            try {
                const token = this.$cookies.get('jwtToken');
                await createFamily(newFamily, token);
                window.location.href = '/';
            } catch (err) {
                this.errorMessage = "Échec de la création de la famille.";
                console.error("An error occurred:", err);
            }
        }
    }
};
</script>