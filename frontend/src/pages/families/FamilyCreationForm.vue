<template>
    <div class="flex align-items-center justify-content-center min-h-screen">
        <div class="flex flex-column ">
            <h1 class="align-self-center">Bienvenue</h1>
            <form id="loginForm" class="flex flex-column row-gap-3 align-content-center w-20rem"
                @submit.prevent="submitLogin">


                <FloatLabel variant="in">
                    <InputText id="email" v-model.trim="email" />
                    <label for="email">Courriel</label>
                </FloatLabel>

                <FloatLabel variant="in">
                    <InputText id="email" v-model.trim="email" />
                    <label for="email">Courriel</label>
                </FloatLabel>

                <!-- <Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message> -->

                <Button :disabled="isLoginDisabled" label="Se connecter" type="submit" />
            </form>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import Message from 'primevue/message';

import FloatLabel from "primevue/floatlabel";

export default {
    components: {
        InputText, Button, Password, Message, InputGroup, InputGroupAddon, FloatLabel
    },
    data: () => {
        return {
            email: "",
            password: "",
            errorMessage: "",
        };
    },
    computed: {
        isLoginDisabled() {
            return !this.email || !this.password;
        }
    },
    methods: {
        async submitCreateFamily() {
            this.errorMessage = "";
            try {
                window.location.href = '/';
            } catch (err) {
                this.errorMessage = "Échec de la création de la famille.";
                console.error("An error occurred:", err);
            }
        }
    }
};
</script>