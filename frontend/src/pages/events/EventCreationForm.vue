<template>
	<div v-if="!isLoading" class="flex flex-col gap-5 min-h-fit w-full">
		<h1 class="text-3xl">{{ $t('newEvent') }}</h1>

		<!-- Contenu principal -->
		<form id="eventForm" class="flex flex-col gap-8 bg-white border rounded-lg p-5"
			  @submit.prevent="submitCreateEvent"
		>
			<!-- Renseignements -->
			<div class="flex flex-col gap-8">

				<!-- Première ligne -->
				<div class="grid grid-cols-2 gap-5">

					<!-- Nom, description, visibilité -->
					<div class="flex flex-col gap-8 p-5 border rounded-lg shadow">
						<!-- Nom -->
						<FloatLabel class="w-full" variant="on">
							<InputText id="name" v-model.trim="name" class="w-full"/>
							<label for="name">{{ $t('eventName') }}</label>
						</FloatLabel>

						<!-- Description -->
						<FloatLabel class="w-full h-full" variant="on">
							<Textarea id="description" v-model.trim="description" class="w-full h-full"/>
							<label for="description">{{ $t('description') }}</label>
						</FloatLabel>

						<!-- Visibilité -->
						<div class="flex items-center gap-8">
							<p>{{ $t('visibility') }}</p>
							<ToggleSwitch id="isVisible" v-model.trim="checked"/>
						</div>
					</div>

					<!-- Dates, heures, répétition -->
					<div class="flex flex-col gap-8 border rounded-lg p-5 h-fit shadow">

						<div class="grid grid-cols-2 gap-8">
							<!-- Date début -->
							<FloatLabel class="w-full" variant="on">
								<DatePicker v-model="startEvent" class="w-full" iconDisplay="input" inputId="startDate"
											showIcon @update:modelValue="onDateChange"/>
								<label for="startDate">{{ $t('startDate') }}</label>
							</FloatLabel>

							<!-- Date fin -->
							<FloatLabel class="w-full" variant="on">
								<DatePicker v-model="endEvent" class="w-full" iconDisplay="input" inputId="endDate"
											showIcon @update:modelValue="onDateChange"/>
								<label for="endDate">{{ $t('endDate') }}</label>
							</FloatLabel>
						</div>

						<!-- Toute la journée -->
						<div class="gap-8 grid grid-cols-2">
							<div class="flex items-center justify-between">
								<p>{{ $t('wholeDay') }}</p>

								<ToggleSwitch id="allDay" v-model.trim="allDay" @update:modelValue="setTimeForAllDay"/>
							</div>
						</div>

						<!-- Heures -->
						<div v-if="!allDay" class="grid grid-cols-2 gap-8">
							<FloatLabel class="w-full" variant="on">
								<DatePicker id="startTime" v-model="startEvent" fluid timeOnly
											@update:modelValue="onDateChange"/>
								<label for="startTime">{{ $t('startTimeLabel') }}</label>
							</FloatLabel>

							<FloatLabel class="w-full" variant="on">
								<DatePicker id="endTime" v-model="endEvent" fluid timeOnly
											@update:modelValue="onDateChange"/>
								<label for="endTime">{{ $t('endTimeLabel') }}</label>
							</FloatLabel>
						</div>

						<!-- Répétition et alertes -->
						<div class="grid grid-cols-2 gap-8">
							<!-- Répétition -->
							<FloatLabel class="w-full" variant="on">
								<Select
									v-model="selectedFrequency" :options="translatedFrequencies"
									class="w-full"
									optionLabel="name"
								/>
								<label class="w-[92px]">{{ $t('repeat') }}</label>
							</FloatLabel>

							<InputNumber v-if="selectedFrequency !== null && selectedFrequency.code !== 'none'"
										 v-model="numberRepeats" :max="365" :min="0" buttonLayout="horizontal"
										 class="text-center w-full" fluid inputId="numberRepeats"
										 inputStyle="text-align: center;"
										 showButtons
							/>
						</div>

						<!-- Alertes -->
						<div class="grid grid-cols-2 gap-8">
							<FloatLabel class="w-full" variant="on">
								<MultiSelect v-model="selectedAlertTypes" :options="translatedAlertTypes"
											 class="w-full"
											 optionLabel="name"
								/>
								<label class="w-[92px]">{{ $t('alerts') }}</label>
							</FloatLabel>
						</div>
					</div>
				</div>

				<!-- Participants -->
				<div class="grid grid-cols-4 gap-5">
					<Button
						v-for="member in allMembers"
						:key="member.id"
						:severity="isSelected(member) ? 'info':'secondary'"
						@click="toggleMemberSelection(member)"
					>
						<div class="inline-flex  items-center justify-between w-full">
							<p class="truncate">{{ member.name }}</p>

							<Avatar
								:image="member.imageUrl"
								:label="!member.imageUrl ? memberInitials(member) : null"
								:style="!member.imageUrl ? `background-color: ${member.color}` : `border: 4px solid ${member.color}`"
								class="font-semibold text-white flex-shrink-0"
								shape="circle"
								size="small"
							/>
						</div>
					</Button>
				</div>
			</div>

			<!-- Bouton de soumission -->
			<div class="flex justify-center">
				<Button
					:disabled="isSubmitButtonDisabled" :label="$t('buttonCreateEvent')" class="w-60"
					type="submit"
				/>
			</div>
		</form>

		<Toast ref="toast" position="bottom-right"/>
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
import {eventSchema} from "@/schemas/eventSchemas.js";
import {createEvent} from "@/services/eventServices.js";
import Avatar from "primevue/avatar";

export default {
	inject: ['token', 'user', 'family'],
	components: {
		InputText,
		Textarea,
		ToggleSwitch,
		DatePicker,
		Select,
		InputNumber,
		MultiSelect,
		Button,
		Message,
		FloatLabel,
		Toast,
		Avatar
	},
	data: () => {
		return {
			name: '',
			description: '',
			checked: false,
			isVisible: true,
			startEvent: '',
			endEvent: '',
			allDay: false,
			selectedFrequency: {name: 'Aucune', code: 'none'},
			frequencies: [
				{labelKey: 'frequencies.none', code: 'none'},
				{labelKey: 'frequencies.daily', code: 'daily'},
				{labelKey: 'frequencies.weekly', code: 'weekly'},
				{labelKey: 'frequencies.monthly', code: 'monthly'},
				{labelKey: 'frequencies.annual', code: 'annual'}
			],
			numberRepeats: '',
			selectedAlertTypes: [],
			alertTypes: [
				{labelKey: 'alertTypes.10min', code: '10min'},
				{labelKey: 'alertTypes.30min', code: '30min'},
				{labelKey: 'alertTypes.1hour', code: '1hour'},
				{labelKey: 'alertTypes.4hours', code: '4hours'},
				{labelKey: 'alertTypes.24hours', code: '24hours'},
			],
			selectedParticipants: [],
			allMembers: [],
			periods: [],
			members: [],
			areValidDates: true,
			errorMessage: "",
			isLoading: true
		};
	},
	computed: {
		isSubmitButtonDisabled() {
			return (!this.name || !this.startEvent || !this.endEvent || this.selectedParticipants.length === 0 ||
				this.startEvent >= this.endEvent);
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
			const dataValidation = {
				name: this.name,
				description: this.description,
				startEvent: this.startEvent,
				endEvent: this.endEvent,
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
				return;
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
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('eventCreationFailure'),
					life: 5000
				});
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
			this.addToPeriods(this.startEvent, this.endEvent);

			if (this.selectedFrequency.code && this.selectedFrequency.code !== 'none') {
				this.handleFrequency(this.selectedFrequency.code, this.startEvent, this.endEvent);
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
		addToPeriods(startDateTime, endDateTime) {
			const newPeriod = {"startDateTime": startDateTime, "endDateTime": endDateTime, alerts: []};
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
		getAllFamilyMembers() {
			this.allMembers = [
				...this.family.accountMembers,
				...this.family.guestMembers
			];

			this.sortMembersAlphabetically(this.allMembers);

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
		},
		sortMembersAlphabetically(members) {
			return members.sort((a, b) => a.name.localeCompare(b.name));
		},
		initializeEventSchedule() {
			this.startEvent = new Date();

			const now = new Date();
			const date = now.getDate();
			const hours = now.getHours();

			this.startEvent.setDate(date);
			this.startEvent.setHours(hours);

			this.endEvent = new Date(this.startEvent);
			this.endEvent.setHours(this.endEvent.getHours() + 1);
		},
		onDateChange() {
			if (this.startEvent > this.endEvent) {
				this.endEvent = this.startEvent;
			}
		}
	},
	mounted() {
		this.getAllFamilyMembers();
		this.initializeEventSchedule();
		this.isLoading = false;
	},
};
</script>