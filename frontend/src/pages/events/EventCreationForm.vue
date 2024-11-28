<template>
	<div class="top-20 w-96 gap-3 flex flex-col pt-20 pb-16">
		<h1 class="text-3xl mb-4 text-center">{{ $t('newEvent') }}</h1>
		<form id="eventForm" class="flex flex-col gap-5" @submit.prevent="submitCreateEvent">
			<div class="flex items-center justify-between">
				<FloatLabel variant="on" class="w-full">
					<InputText id="name" v-model.trim="name" class="w-full" />
					<label for="name">{{ $t('eventName') }}</label>
				</FloatLabel>
			</div>
			<div>
				<FloatLabel variant="on">
					<Textarea id="description" v-model.trim="description" rows="2" class="w-full" />
					<label for="description">{{ $t('description') }}</label>
				</FloatLabel>
			</div>
			<div class="flex items-center gap-3">
				<p>{{ $t('visibility') }}</p>
				<ToggleSwitch id="isVisible" v-model.trim="checked" />
			</div>
			<div class="flex flex-col border p-3 rounded-lg gap-3">
				<p class="text-lg text-center">{{ $t('participants') }}</p>
				<div v-for="member in allMembers" :key="member.id"
					class="flex flex-inline items-center justify-between border p-3 rounded-lg"
					:class="{ 'bg-blue-100': isSelected(member) }" @click="toggleMemberSelection(member)"
					style="cursor: pointer;">
					<p>{{ member.name }}</p>
					<Avatar v-if="member.imageUrl" :image="member.imageUrl" shape="circle" size="small" class="border-4"
						:style="{ borderColor: member.color }" />
					<Avatar v-else :label="memberInitials(member)" :style="`background-color: ${member.color}`"
						class="font-semibold text-white" shape="circle" size="small" />
				</div>
			</div>
			<div class="flex items-center gap-3">
				<FloatLabel variant="on">
					<DatePicker v-model="startDate" inputId="startDate" showIcon iconDisplay="input"
						@update:modelValue="onDateChange" />
					<label for="startDate">{{ $t('startDate') }}</label>
				</FloatLabel>
				<FloatLabel variant="on">
					<DatePicker v-model="endDate" inputId="endDate" showIcon iconDisplay="input"
						@update:modelValue="onDateChange" />
					<label for="endDate">{{ $t('endDate') }}</label>
				</FloatLabel>
			</div>
			<div class="flex items-center gap-3">
				<p>{{ $t('wholeDay') }}</p>
				<ToggleSwitch id="allDay" v-model.trim="allDay" @update:modelValue="onDateChange" />
			</div>
			<div class="flex items-center gap-3" v-if="!allDay">
				<DatePicker id="startTime" v-model="startTime" timeOnly fluid @update:modelValue="onDateChange" />
				<DatePicker id="endTime" v-model="endTime" timeOnly fluid @update:modelValue="onDateChange" />
			</div>
			<Message v-if="!areValidDates" severity="error" icon="pi pi-times-circle" class="mb-2">La date/heure de fin
				de l'événement doit être après le début!</Message>
			<div class="flex items-center gap-3">
				<label>{{ $t('repeat') }}</label>
				<Select v-model="selectedFrequency" :options="translatedFrequencies" optionLabel="name"
					:placeholder="$t('nonePlaceholder')" />
			</div>
			<div class="flex items-center gap-3" v-if="selectedFrequency !== null && selectedFrequency.code !== 'none'">
				<label for="numberRepeats">{{ $t('numberRepeats') }}</label>
				<InputNumber v-model="numberRepeats" inputId="numberRepeats" showButtons buttonLayout="vertical"
					style="width: 10rem" :min="0" :max="365" fluid />
			</div>
			<div class="flex items-center gap-3">
				<label>{{ $t('alerts') }}</label>
				<MultiSelect v-model="selectedAlertTypes" :options="translatedAlertTypes" optionLabel="name"
					:placeholder="$t('nonePlaceholder')" :showSelectAll="false" />
			</div>
			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isSubmitButtonDisabled" :label="$t('buttonCreateEvent')" raised type="submit" />
		</form>

		<Toast ref="toast" position="bottom-right" />
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
import { getAllMembersByFamilyId } from "@/services/memberServices.js";
import { getMemberImage } from "@/services/memberServices.js";
import Avatar from "primevue/avatar";

export default {
	inject: ['token', 'user'],
	components: {
		InputText, Textarea, ToggleSwitch, DatePicker, Select, InputNumber, MultiSelect, Button, Message, FloatLabel, Toast, Avatar
	},
	data: () => {
		return {
			name: '',
			description: '',
			checked: false,
			isVisible: true,
			startDate: '',
			endDate: '',
			allDay: false,
			startTime: '',
			endTime: '',
			selectedFrequency: { name: 'Aucune', code: 'none' },
			frequencies: [
				{ labelKey: 'frequencies.none', code: 'none' },
				{ labelKey: 'frequencies.daily', code: 'daily' },
				{ labelKey: 'frequencies.weekly', code: 'weekly' },
				{ labelKey: 'frequencies.monthly', code: 'monthly' },
				{ labelKey: 'frequencies.annual', code: 'annual' }
			],
			numberRepeats: '',
			selectedAlertTypes: [],
			alertTypes: [
				{ labelKey: 'alertTypes.10min', code: '10min' },
				{ labelKey: 'alertTypes.30min', code: '30min' },
				{ labelKey: 'alertTypes.1hour', code: '1hour' },
				{ labelKey: 'alertTypes.4hours', code: '4hours' },
				{ labelKey: 'alertTypes.24hours', code: '24hours' },
			],
			selectedParticipants: [],
			allMembers: [],
			periods: [],
			members: [],
			areValidDates: true,
			errorMessage: ""
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return (!this.name || !this.startDate || !this.endDate || this.selectedParticipants.length === 0 || !this.areValidDates);
		},
		translatedFrequencies() {
			return this.frequencies.map(frequency => ({
				...frequency,
				name: this.$t(frequency.labelKey) // Traduction dynamique
			}));
		},
		translatedAlertTypes() {
			return this.alertTypes.map(alert => ({
				...alert,
				name: this.$t(alert.labelKey) // Traduction dynamique
			}));
		}
	},
	methods: {
		async submitCreateEvent() {

			// Empêcher l'envoi si le formulaire n'est pas valide
			if (this.isSubmitButtonDisabled) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: "Le formulaire contient des erreurs. Veuillez vérifier les champs.",
					life: 5000
				});
				return;
			}

			const dataValidation = {
				name: this.name,
				description: this.description,
				startDate: this.startDate,
				endDate: this.endDate,
				startTime: this.startTime,
				endTime: this.endTime,
				numberRepeats: this.numberRepeats,
				selectedParticipants: this.selectedParticipants
			}

			try {
				await eventSchema.validate(dataValidation);
			} catch (err) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: err.message,
					life: 5000
				});
			}

			this.setIsVisible();
			this.setPeriods();

			const eventDetails = {
				name: this.name,
				description: this.description,
				isVisible: this.isVisible,
				periods: this.periods,
				members: this.selectedParticipants
			}

			try {
				await createEvent(eventDetails, this.token);
				this.$router.push('/events');
			} catch {
				this.errorMessage = "Échec lors de la création.";
			}
		},
		setIsVisible() {
			if (this.checked) {
				this.isVisible = false;
			} else {
				this.isVisible = true;
			}
		},
		setPeriods() {

			const initialStartDateTime = this.combineDateTime(this.startDate, this.startTime);
			const initialEndDateTime = this.combineDateTime(this.endDate, this.endTime);

			this.addToPeriods(initialStartDateTime, initialEndDateTime);

			if (this.selectedFrequency.code && this.selectedFrequency.code !== 'none') {
				this.handleFrequency(this.selectedFrequency.code, initialStartDateTime, initialEndDateTime);
			}

			if (this.selectedAlertTypes.length > 0) {
				for (let alert of this.selectedAlertTypes) {
					this.handleAlerts(alert.code);
				}
			}
		},
		setTimeForAllDay() {
			if (this.allDay) { // Si toute la journée a été sélectionnée, régler startTime à minuit et endTime à 23h59
				if (!this.startTime) this.startTime = new Date();
				if (!this.endTime) this.endTime = new Date();
				this.startTime.setHours(0, 0, 0, 0);
				this.endTime.setHours(23, 59, 0, 0);
			}
		},
		combineDateTime(date, time) {
			if (!date || !time) return null; // Vérifie si les deux valeurs existent

			// Convertit date et time en chaînes pour obtenir les parties de date et d'heure
			const datePart = date.toISOString().split('T')[0]; // YYYY-MM-DD

			const hours = String(time.getHours()).padStart(2, '0');
			const minutes = String(time.getMinutes()).padStart(2, '0');

			// Combine les parties de date et d'heure dans un format ISO
			return new Date(`${datePart}T${hours}:${minutes}:00`);
		},
		addToPeriods(startDateTime, endDateTime) {
			const newPeriod = { "startDateTime": startDateTime, "endDateTime": endDateTime, alerts: [] };
			this.periods.push(newPeriod);
		},
		handleFrequency(frequencyCode, initialStartDateTime, initialEndDateTime) {
			const startDateCopy = new Date(initialStartDateTime);
			const endDateCopy = new Date(initialEndDateTime);

			const incrementDate = (date, frequency) => {
				switch (frequency) {
					case 'daily':
						date.setDate(date.getDate() + 1);
						break;
					case 'weekly':
						date.setDate(date.getDate() + 7);
						break;
					case 'monthly':
						date.setMonth(date.getMonth() + 1);
						break;
					case 'annual':
						date.setFullYear(date.getFullYear() + 1);
						break;
					default:
						console.log("Fréquence non reconnue");
				}
			};

			for (let i = 0; i < this.numberRepeats; i++) {
				// Incrémente les dates pour la prochaine période
				incrementDate(startDateCopy, frequencyCode);
				incrementDate(endDateCopy, frequencyCode);

				const convertedStartDateCopy = startDateCopy.toISOString();
				const convertedEndDateCopy = endDateCopy.toISOString();

				// Ajoute la période mise à jour
				this.addToPeriods(convertedStartDateCopy, convertedEndDateCopy);
			}
		},
		handleAlerts(alertCode) {
			// Dictionnaire associant les codes d'alerte à la durée en millisecondes
			const alertCalculation = {
				'10min': 10 * 60 * 1000,
				'30min': 30 * 60 * 1000,
				'1hour': 60 * 60 * 1000,
				'4hours': 4 * 60 * 60 * 1000,
				'24hours': 24 * 60 * 60 * 1000
			};

			// Vérifie si le code d'alerte est valide
			if (alertCalculation[alertCode] !== undefined) {
				for (let period of this.periods) {
					const startDateTime = new Date(period.startDateTime);
					const alertTime = new Date(startDateTime.getTime() - alertCalculation[alertCode]);
					period.alerts.push(alertTime);
				}
			} else {
				console.log("Alerte non reconnue");
			}
		},
		memberInitials(member) {
			return member.name.charAt(0).toUpperCase();
		},
		toggleMemberSelection(member) {
			const index = this.selectedParticipants.indexOf(member.id);
			if (index === -1) {
				// Si le membre n'est pas encore sélectionné, on l'ajoute
				this.selectedParticipants.push(member.id);
			} else {
				// Si le membre est déjà sélectionné, on le retire
				this.selectedParticipants.splice(index, 1);
			}
		},
		isSelected(member) {
			return this.selectedParticipants.includes(member.id);
		},
		async getAllFamilyMembers() {
			try {
				const familyMembers = await getAllMembersByFamilyId(this.token);

				this.allMembers = [
					...familyMembers.accountMembers,
					...familyMembers.guestMembers
				];

				this.allMembers.forEach(async member => {
					member.imageUrl = await getMemberImage(this.token, member.id);
				});

				if (this.user) {
					// Filtre pour retirer toute occurrence de `this.user` dans `allMembers` dans le but de l'ajouter au début de la liste
					this.allMembers = this.allMembers.filter(member => member.id !== this.user.id);

					// Ajoute `this.user` au début de la liste
					this.allMembers.unshift(this.user);

					// Sélectionner l'utilisateur par défaut
					if (!this.selectedParticipants.includes(this.user.id)) {
						this.selectedParticipants.push(this.user.id);
					}
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		},
		initializeDate() {
			this.startDate = new Date();

			const now = new Date();
			const date = now.getDate();

			this.startDate.setDate(date);
		},
		initializeTime() {
			this.startTime = new Date();

			const now = new Date();
			const hours = now.getHours();

			this.startTime.setHours(hours);
		},
		onDateChange() {
			this.setTimeForAllDay();

			const initialStartDateTime = this.combineDateTime(this.startDate, this.startTime);
			const initialEndDateTime = this.combineDateTime(this.endDate, this.endTime);

			this.validateDates(initialStartDateTime, initialEndDateTime)
		},
		validateDates(startDateTime, endDateTime) {
			if (!startDateTime || !endDateTime) {
				this.areValidDates = true; // Laissez passer tant que l'utilisateur n'a pas rempli toutes les valeurs
				return;
			}

			this.areValidDates = endDateTime >= startDateTime;
		}

	},
	mounted() {
		this.getAllFamilyMembers();
		this.initializeDate();
		this.initializeTime();
	},
	watch: {
		startDate(newStartDate) {
			if (!this.endDate || this.endDate < this.startDate) {
				this.endDate = newStartDate;
				this.onDateChange();
			}
		},
		endDate(newEndDate) {
			if (this.endDate < this.startDate) {
				this.startDate = newEndDate;
				this.onDateChange();
			}
		},
		startTime(newStartTime) {
			const endTime = new Date(newStartTime);
			endTime.setHours(endTime.getHours() + 1);
			this.endTime = endTime;
			this.onDateChange();
		},
		endTime(newEndTime) {
			if (newEndTime < this.startTime && this.startDate === this.endDate) {
				const startTime = new Date(newEndTime);
				startTime.setHours(startTime.getHours() - 1);
				this.startTime = startTime;
				this.onDateChange();
			}
		}
	}
};
</script>