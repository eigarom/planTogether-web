<template>
    <div v-if="event">
        <div>Nom de l'événement: {{ event.name }}</div>
        <div>Description de l'événement: {{ event.description }}</div>
        <div>Couleur de l'événement: {{ event.color }}</div>
        <div>Visibilité de l'événement: {{ event.isVisible }}</div>
        <div>
            <h3>Périodes de l'événement:</h3>
            <ul>
                <li v-for="(period, index) in event.periods" :key="index">
                    Début: {{ period.startDateTime }} - Fin: {{ period.endDateTime }}
                </li>
            </ul>
        </div>
        <div>
            <h3>Alertes:</h3>
            <ul>
                <li v-for="(alert, index) in event.alerts" :key="index">
                    Temps: {{ alert.dateTime }}
                </li>
            </ul>
        </div>
        <div>
            <h3>Participants à l'événement:</h3>
            <ul>
                <li v-for="(member, index) in event.members" :key="index">
                    {{ member.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { getEvent } from '../../services/eventServices';

export default {
    props: {
        id: String
    },
    data() {
        return {
            idEvent: this.id,
            event: {},
            loading: true
        }
    },
    methods: {
        async getEventWithToken(id) {
            const token = this.$cookies.get('jwtToken');
            if (token) {
                try {
                    this.event = await getEvent(token, id);
                    console.log("Event data:", this.event);
                } catch (error) {
                    this.event = null;
                    console.error('Erreur:', error);
                }
            }
            this.loading = false;
        },
    },
    watch: {
        id(newId) {
            this.getEventWithToken(newId);
        }
    },
    mounted() {
        this.getEventWithToken(this.id);
    }

}

</script>