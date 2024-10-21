<template>
    <div>Nom de l'événement: {{ name }}</div>
    <div>Description de l'événement: {{ description }}</div>
    <div>Couleur de l'événement: {{ color }}</div>
    <div>Visibilité de l'événement: {{ isVisible }}</div>
    <div>
        <h3>Périodes de l'événement:</h3>
        <ul>
            <li v-for="(period, index) in periods" :key="index">
                Début: {{ period.startDateTime }} - Fin: {{ period.endDateTime }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        id: Number,
        name: String,
        description: String,
        color: String,
        isVisible: Boolean,
        periods: Array,
        alerts: Array
    },
    
}

</script>