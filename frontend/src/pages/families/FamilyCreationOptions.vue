<template>
    <div class="flex align-items-center justify-content-center min-h-screen">
        <div class="flex flex-column ">
            <Button as="router-link" label="Créer une famille" to="/families" />
        </div>
    </div>
</template>

<script>
import Button from "primevue/button";

export default {
    components: {
        Button
    }
}
</script>