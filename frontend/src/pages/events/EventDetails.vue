<template>
    <div v-if="event">
        <div :style="{ fontSize: '24px' }"> {{ event.name }}</div>
        <div>Description : {{ event.description }}</div>
        <div>Visibilité : {{ formatIsVisible(event.isVisible) }}</div>
        <br />
        <hr />
        <div>
            <h3>Périodes de l'événement:</h3>
            <ul>
                <li v-for="(period, index) in event.periods" :key="index">
                    Début: {{ formatDate(period.startDateTime) }} - Fin: {{ formatDate(period.endDateTime) }}
                </li>
            </ul>
        </div>
        <br />
        <hr />
        <div>
            <h3>Alertes:</h3>
            <ul v-if="event.alerts && event.alerts.length > 0">
                <li v-for="(alert, index) in event.alerts" :key="index">
                    Temps: {{ alert.dateTime }}
                </li>
            </ul>
            <p v-else>Aucune</p>
        </div>
        <br />
        <hr />
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
        formatDate(dateString) {
            const [datePart, timePart] = dateString.split('T');
            const time = timePart.substring(0, 5);
            return `${datePart} ${time}`;
        },
        formatIsVisible(isVisible) {
            if (isVisible) {
                return "Public"
            }
            else {
                return "Privé"
            }
        }
    },
    mounted() {
        this.getEventWithToken(this.id);
    }

}

</script>