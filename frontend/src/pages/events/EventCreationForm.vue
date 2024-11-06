<template>
	<div class="flex h-full justify-center items-center">
		<div class="w-96">
			<h1 class="text-3xl mb-8 text-center">Nouvel événement</h1>
			<form id="profileForm" class="flex flex-col gap-5" @submit.prevent="submitCreateEvent">
				<div class="flex items-center justify-between">
					<FloatLabel variant="on" class="w-full">
						<InputText id="name" v-model.trim="name" class="w-full" />
						<label for="name">Nom</label>
					</FloatLabel>
				</div>
				<div>
					<FloatLabel variant="on">
						<Textarea id="description" v-model.trim="description" rows="2" class="w-full" />
						<label for="description">Description</label>
					</FloatLabel>
				</div>
				<div class="flex items-center gap-3">
					<p>Visible uniquement par moi</p>
					<ToggleSwitch id="isVisible" v-model.trim="checked" />
				</div>
				<div class="flex items-center gap-3">
					<FloatLabel variant="on">
						<DatePicker v-model="startDate" inputId="startDate" showIcon iconDisplay="input" />
						<label for="startDate">Début</label>
					</FloatLabel>
					<FloatLabel variant="on">
						<DatePicker v-model="endDate" inputId="endDate" showIcon iconDisplay="input" />
						<label for="endDate">Fin</label>
					</FloatLabel>
				</div>
				<div class="flex items-center gap-3">
					<p>Journée entière</p>
					<ToggleSwitch id="allDay" v-model.trim="allDay" />
				</div>
				<div class="flex items-center gap-3" v-if="!allDay">
					<DatePicker id="startTime" v-model="startTime" timeOnly fluid :placeholder="placeholderStartTime" />
					<DatePicker id="endTime" v-model="endTime" timeOnly fluid :placeholder="placeholderEndTime" />
				</div>
				<div class="flex items-center gap-3">
					<label>Répétition</label>
					<Select v-model="selectedFrequency" :options="frequencies" optionLabel="name" default="none" />
				</div>
				<div class="flex items-center gap-3"
					v-if="selectedFrequency !== null && selectedFrequency.code !== 'none'">
					<label for="numberRepeats">Nombre de répétitions</label>
					<InputNumber v-model="numberRepeats" inputId="numberRepeats" showButtons buttonLayout="vertical"
						style="width: 10rem" :min="0" :max="365" fluid />
				</div>
				<div class="flex items-center gap-3">
					<label>Alertes</label>
					<MultiSelect v-model="selectedAlertTypes" :options="alertTypes" optionLabel="name"
						placeholder="Aucune" :showSelectAll="false" />
				</div>
				<div class="flex items-center gap-3">
					<label>Participants</label>
					<MultiSelect v-model="selectedParticipants" :options="participantsList" optionLabel="name"
						placeholder="Aucune" :showSelectAll="false" />
				</div>
				<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

				<Button :disabled="isSubmitButtonDisabled" :label="$t('buttonCreateEvent')" raised type="submit" />
			</form>

			<Toast ref="toast" position="bottom-right" />
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Button from "primevue/button";
import Message from 'primevue/message';
import FloatLabel from "primevue/floatlabel";
import Toast from 'primevue/toast';
import { eventSchema } from "@/schemas/eventSchemas.js";
import { createEvent } from "@/services/eventServices.js";

export default {
	inject: ['token'],
	components: {
		InputText, Textarea, ToggleSwitch, DatePicker, Select, InputNumber, MultiSelect, Button, Message, FloatLabel, Toast
	},
	data: () => {
		return {
			name: '',
			description: '',
			checked: false,
			isVisible: "",
			startDate: null,
			endDate: null,
			allDay: false,
			startTime: null,
			endTime: null,
			placeholderStartTime: null,
			placeholderEndTime: null,			
			selectedFrequency: { name: 'Aucune', code: 'none' },
			frequencies: [
				{ name: 'Aucune', code: 'none' },
				{ name: 'Quotidienne', code: 'daily' },
				{ name: 'Hebdomadaire', code: 'weekly' },
				{ name: 'Mensuelle', code: 'monthly' },
				{ name: 'Annuelle', code: 'annual' }
			],
			numberRepeats: '',
			selectedAlertTypes: [],
			alertTypes: [
				{ name: '10 minutes avant', code: '10min' },
				{ name: '30 minutes avant', code: '30min' },
				{ name: '1 heure avant', code: '1Hour' },
				{ name: '4 heures avant', code: '4Hour' },
				{ name: '24 heures avant', code: '24hours' },
			],
			selectedParticipants: [],
			participantsList: [
				{ name: 'Diddy', code: 'diddy' },
				{ name: 'Dixie', code: 'dixie' }
			],
			periods: [],
			alerts: [],
			members: [],
			errorMessage: "",
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return !this.name && !this.startDate;
		}
	},
	methods: {
		async submitCreateEvent() {
			this.errorMessage = "";



			const eventDetails = {
				// name: this.name,
				// color: this.color
			}

			const { error } = eventSchema.validate({ name: this.name, isVisible: this.isVisible });
			if (error) {
				this.errorMessage = error.message;
				return
			}

			try {
				await createEvent(eventDetails, this.token);
				this.$router.push('/events');
			} catch {
				this.errorMessage = "Échec lors de la création.";
			}
		},
		setPlaceholderStartTime() {
			const now = new Date();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			this.placeholderStartTime = `${hours}:${minutes}`;
		},
		setPlaceholderEndTime() {
			const now = new Date();

			const hours = String(now.getHours() + 1).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			this.placeholderEndTime = `${hours}:${minutes}`;
		},
	},
	mounted() {
		this.setPlaceholderStartTime();
		this.setPlaceholderEndTime();
	},
	watch: {
		startDate(newStartDate) {
			if (!this.endDate) {
				this.endDate = newStartDate;
			}
		},
		startTime(newStartTime) {
			const endTime = new Date(newStartTime);
			endTime.setHours(endTime.getHours() + 1);
			this.endTime = endTime;
		},
		endTime(newEndTime) {
			if (newEndTime < this.startTime) {
				const startTime = new Date(newEndTime);
				startTime.setHours(startTime.getHours() - 1);
				this.startTime = startTime;
			}
		}
	}
};
</script>