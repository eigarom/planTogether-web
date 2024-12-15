<template>
	<div v-if="!isLoading" class="flex flex-col gap-3 min-h-fit w-full">
		<h1 class="text-2xl">{{ $t('eventDetailTitle') }}</h1>

		<!-- Contenu principal -->
		<form id="eventForm" class="flex flex-col gap-8 bg-white border rounded-lg p-5"
			  @submit.prevent="submitUpdateEvent"
		>
			<!-- Renseignements -->
			<div class="flex flex-col gap-8">

				<!-- Première ligne -->
				<div class="grid grid-cols-2 gap-5">

					<!-- Nom, description, visibilité -->
					<div class="flex flex-col gap-8 p-5 bg-white border rounded-lg shadow">
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
						<div class="flex items-center gap-3">
							<p>{{ $t('visibility') }}</p>
							<ToggleSwitch id="isVisible" v-model.trim="checked"/>
						</div>
					</div>

					<!-- Dates, heures, alertes -->
					<form id="periodForm" class="flex flex-col gap-8 border rounded-lg p-5 h-fit bg-white shadow"
						  @submit.prevent="submitUpdatePeriod">

						<div class="grid grid-cols-2 gap-5">
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
						<div v-if="!allDay" class="grid grid-cols-2 gap-5">
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

						<!-- Alertes -->
						<div class="grid grid-cols-2 gap-8">
							<FloatLabel class="w-full" variant="on">
								<MultiSelect v-model="translatedSelectedAlertTypes" :options="translatedAlertTypes"
											 class="w-full"
											 optionLabel="name"
								/>
								<label>{{ $t('alerts') }}</label>
							</FloatLabel>
						</div>

						<!-- Bouton de soumission -->
						<div class="flex justify-center">
							<Button
								:disabled="isSubmitPeriodButtonDisabled" :label="$t('buttonUpdatePeriod')" class="w-60"
								type="submit"
							/>
						</div>
					</form>

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

				<div class="flex gap-8 justify-center">
					<Button
						:disabled="isSubmitEventButtonDisabled" :label="$t('buttonUpdateEvent')" class="w-60"
						type="submit"
					/>

					<Button
						:label="$t('deleteButton')" class=" w-60" severity="danger" @click="promptDeleteOption($event)"
					/>
				</div>
			</div>
		</form>

		<ConfirmDialog></ConfirmDialog>
		<Toast ref="toast" position="bottom-right"/>
	</div>
</template>

<script>
import {
	deleteEvent,
	deletePeriod,
	getEvent,
	getNumberOfPeriodsByEventId,
	updateEventById,
	updatePeriodById
} from '@/services/eventServices.js';
import {eventOnlySchema, eventPeriodSchema} from "@/schemas/eventSchemas.js";
import FloatLabel from "primevue/floatlabel";
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import Avatar from "primevue/avatar";
import DatePicker from 'primevue/datepicker';
import Button from "primevue/button";
import ConfirmDialog from 'primevue/confirmdialog';
import MultiSelect from 'primevue/multiselect';

export default {
	inject: ['token', 'user', 'family'],
	components: {
		FloatLabel,
		Toast,
		InputText,
		Textarea,
		ToggleSwitch,
		Button,
		Avatar,
		DatePicker,
		ConfirmDialog,
		MultiSelect
	},
	props: {
		id: String,
		periodId: String
	},
	data() {
		return {
			event: {},
			name: "",
			description: "",
			checked: false,
			isVisible: false,
			period: {},
			members: [],
			startEvent: "",
			endEvent: "",
			allDay: false,
			selectedParticipants: [],
			allMembers: [],
			startDateTime: "",
			endDateTime: "",
			alerts: [],
			selectedAlertTypes: [],
			alertTypes: [
				{labelKey: 'alertTypes.10min', code: '10min'},
				{labelKey: 'alertTypes.30min', code: '30min'},
				{labelKey: 'alertTypes.1hour', code: '1hour'},
				{labelKey: 'alertTypes.4hours', code: '4hours'},
				{labelKey: 'alertTypes.24hours', code: '24hours'},
			],
			translatedAlertTypes: [],
			updatedAlerts: [],
			errorMessage: "",
			isLoading: true
		}
	},
	computed: {
		isSubmitEventButtonDisabled() {
			return (!this.name || this.selectedParticipants.length === 0);
		},
		isSubmitPeriodButtonDisabled() {
			return (!this.startEvent || !this.endEvent || this.startEvent >= this.endEvent);
		},
		translatedSelectedAlertTypes: {
			get() {
				return this.selectedAlertTypes.map((alertType) => ({
					...alertType,
					name: this.$t(alertType.labelKey),
				}));
			},
			set(updatedSelection) {
				this.selectedAlertTypes = updatedSelection.map((alertType) => ({
					labelKey: alertType.labelKey,
					code: alertType.code,
					// On ne met pas à jour `name` ici, car il sera recalculé dynamiquement
				}));
			},
		},
	},
	methods: {
		async getEventWithToken() {
			const token = this.$cookies.get('jwtToken');
			if (token) {
				try {
					this.event = await getEvent(token, this.id, this.periodId);
					this.name = this.event.name;
					this.description = this.event.description;
					this.isVisible = this.event.isVisible;
					this.period = this.event.period;
					this.members = this.event.members;
					this.selectedParticipants = this.members.map(member => member.id);

					this.setIsChecked();
					this.getAllFamilyMembers();
					this.setDateTime();
					this.setAlerts();
					this.setIsAllDay();
				} catch (error) {
					this.event = null;
					console.error('Erreur:', error);
				}
			}
		},
		setIsChecked() {
			this.checked = !this.isVisible;
		},
		setDateTime() {
			this.startEvent = new Date(this.period.startDateTime);
			this.endEvent = new Date(this.period.endDateTime);
		},
		setIsAllDay() {
			this.allDay = this.startEvent.getHours() === 0 &&
				this.startEvent.getMinutes() === 0 &&
				this.endEvent.getHours() === 23 &&
				this.endEvent.getMinutes() === 59 &&
				this.startEvent.toDateString() === this.endEvent.toDateString();
		},
		async submitUpdateEvent() {
			this.setIsVisible();

			const eventDetails = {
				name: this.name,
				description: this.description,
				isVisible: this.isVisible,
				members: this.selectedParticipants
			}
			try {
				await eventOnlySchema.validate(eventDetails);
				await updateEventById(this.token, eventDetails, this.id);
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastUpdateEventSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: err.message,
						life: 5000
					});
				} else {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: this.$t('errorUpdateMessage'),
						life: 5000
					});
				}
			}
		},
		setIsVisible() {
			this.isVisible = !this.checked;
		},
		async submitUpdatePeriod() {
			const periodValidation = {
				startEvent: this.startEvent,
				endEvent: this.endEvent,
				alerts: this.updatedAlerts
			}

			try {
				await eventPeriodSchema.validate(periodValidation);
			} catch (err) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: err.message,
					life: 5000
				});
			}

			this.setAlertPeriods();

			const periodDetails = {
				startDateTime: this.startEvent,
				endDateTime: this.endEvent,
				alerts: this.updatedAlerts
			}

			try {
				await updatePeriodById(this.token, periodDetails, this.periodId, this.id);
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastUpdatePeriodSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: err.message,
						life: 5000
					});
				} else {
					this.$refs.toast.add({
						severity: 'error',
						summary: this.$t('toastErrorTitle'),
						detail: this.$t('errorUpdateMessage'),
						life: 5000
					});
				}
			}
		},
		setAlertPeriods() {
			if (this.selectedAlertTypes.length > 0) {
				for (let alert of this.selectedAlertTypes) {
					this.handleAlerts(alert.code);
				}
			}
		},
		setTimeForAllDay() {
			this.startEvent.setHours(0, 0, 0, 0);
			this.endEvent.setHours(23, 59, 0, 0);
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
			}
		},
		sortMembersAlphabetically(members) {
			return members.sort((a, b) => a.name.localeCompare(b.name));
		},
		setAlerts() {
			this.alerts = this.period.alerts;
			this.selectedAlertTypes = [];

			// Parcours des alertes existantes
			this.alerts.forEach(alert => {
				const alertDateTime = new Date(alert.dateTime);
				const startDateTime = new Date(this.startEvent);

				// Calcul de la différence en minutes entre l'alerte et le début
				const diffInMinutes = Math.round((startDateTime - alertDateTime) / (1000 * 60));

				// Vérifie à quel type d'alerte cette différence correspond
				const matchingAlertType = this.alertTypes.find(type => {
					switch (type.code) {
						case '10min':
							return diffInMinutes === 10;
						case '30min':
							return diffInMinutes === 30;
						case '1hour':
							return diffInMinutes === 60;
						case '4hours':
							return diffInMinutes === 240;
						case '24hours':
							return diffInMinutes === 1440;
						default:
							return false;
					}
				});

				// Ajoute l'alerte correspondante à la sélection si elle existe
				if (matchingAlertType) {
					this.selectedAlertTypes.push({
						labelKey: matchingAlertType.labelKey,
						code: matchingAlertType.code,
						name: this.$t(matchingAlertType.labelKey) // Traduction dynamique du `name`
					});
				}
			});
		},
		updateTranslatedAlertTypes() {
			// Recrée les objets avec les traductions dynamiques
			this.translatedAlertTypes = this.alertTypes.map(type => ({
				...type,
				name: this.$t(type.labelKey) // Utilise le $t pour traduire le champ `name`
			}));
		},
		onDateChange() {
			if (this.startEvent >= this.endEvent) {
				this.endEvent = new Date(this.startEvent);
				this.endEvent.setHours(this.endEvent.getHours() + 1);
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
				const startDateTime = new Date(this.startDateTime);
				const alertTime = new Date(startDateTime.getTime() - alertCalculation[alertCode]);
				this.updatedAlerts.push(alertTime);
			} else {
				console.log("Alerte non reconnue");
			}
		},
		async getNumberOfPeriods() {
			try {
				return await getNumberOfPeriodsByEventId(this.token, this.id);
			} catch (error) {
				console.error('Erreur:', error);
			}
		},
		async promptDeleteOption(event) {
			try {
				const numberOfPeriods = await this.getNumberOfPeriods();
				if (numberOfPeriods > 1) {
					this.$confirm.require({
						target: event.currentTarget,
						header: this.$t('deleteEventTitle'),
						message: this.$t('deleteChooseOption'),
						icon: 'pi pi-question-circle',
						acceptProps: {
							label: this.$t('deleteEventOption'),
							severity: 'danger',
						},
						rejectProps: {
							label: this.$t('deletePeriodOption'),
							severity: 'danger',
						},
						accept: async () => {
							// Suppression de l'événement
							try {
								await deleteEvent(this.token, this.id);
								window.location.href = '/events'; // Redirection
							} catch (error) {
								console.error('Erreur lors de la suppression de l\'événement :', error);
								this.$refs.toast.add({
									severity: 'error',
									summary: this.$t('toastErrorTitle'),
									detail: this.$t('errorDeleteMessage'),
									life: 5000,
								});
							}
						},
						reject: async () => {
							// Suppression de la période
							try {
								await deletePeriod(this.token, this.id, this.periodId);
								window.location.href = '/events';
							} catch (error) {
								console.error('Erreur lors de la suppression de la période :', error);
								this.$refs.toast.add({
									severity: 'error',
									summary: this.$t('toastErrorTitle'),
									detail: this.$t('errorDeleteMessage'),
									life: 5000,
								});
							}
						},
					});
				} else {
					this.$confirm.require({
						target: event.currentTarget,
						header: this.$t('deleteEventTitle'),
						message: this.$t('deleteEventConfirm'),
						icon: 'pi pi-exclamation-triangle',
						rejectProps: {
							label: this.$t('cancelButton'),
							severity: 'secondary',
							outlined: true
						},
						acceptProps: {
							label: this.$t('deleteEventOption'),
							severity: 'danger'
						},
						accept: async () => {
							try {
								await deleteEvent(this.token, this.id);
								window.location.href = '/events';
							} catch {
								this.$refs.toast.add({
									severity: 'error',
									summary: this.$t('toastErrorTitle'),
									detail: this.$t('errorDeleteMessage'),
									life: 5000
								});
							}
						}
					});
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		},
	},
	mounted() {
		this.getEventWithToken();
		this.isLoading = false;
	},
	watch: {
		'$i18n.locale': {
			handler() {
				this.updateTranslatedAlertTypes(); // Mettre à jour la liste des types d'alertes
			},
			immediate: true // Met à jour dès que le composant est monté
		}
	}
}
</script>