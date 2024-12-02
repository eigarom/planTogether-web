<template>
	<div v-if="event" class="top-20 w-96 gap-3 flex flex-col pt-20 pb-16">
		<h1 class="text-3xl mb-4 text-center">{{ $t('eventDetailTitle') }}</h1>
		<form id="eventForm" class="flex flex-col gap-5 border p-3 rounded-lg" @submit.prevent="submitUpdateEvent">
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
			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isSubmitEventButtonDisabled" :label="$t('buttonUpdateEvent')" raised type="submit" />
		</form>

		<form id="periodForm" class="flex flex-col gap-5 border p-3 rounded-lg" @submit.prevent="submitUpdatePeriod">
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
			<Message v-if="!areValidDates" severity="error" icon="pi pi-times-circle" class="mb-2"> {{
				$t('datesErrorMessage') }}</Message>

			<div class="flex items-center gap-3">
				<label>{{ $t('alerts') }}</label>
				<MultiSelect v-model="translatedSelectedAlertTypes" :options="translatedAlertTypes" optionLabel="name"
					:showSelectAll="false" />
			</div>

			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isSubmitPeriodButtonDisabled" :label="$t('buttonUpdatePeriod')" raised type="submit" />
		</form>
		<Button :label="$t('deleteButton')" raised severity="danger" @click="promptDeleteOption($event)" />
		<ConfirmDialog></ConfirmDialog>
		<Toast ref="toast" position="bottom-right" />
	</div>
</template>

<script>
import { getEvent, updateEventById, updatePeriodById, deleteEvent, deletePeriod, getNumberOfPeriodsByEventId } from '@/services/eventServices.js';
import { getAllMembersByFamilyId } from "@/services/memberServices.js";
import { getMemberImage } from "@/services/memberServices.js";
import { eventOnlySchema, eventPeriodSchema } from "@/schemas/eventSchemas.js";
import FloatLabel from "primevue/floatlabel";
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import Avatar from "primevue/avatar";
import DatePicker from 'primevue/datepicker';
import Button from "primevue/button";
import ConfirmDialog from 'primevue/confirmdialog';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';

export default {
	inject: ['token', 'user'],
	components: {
		FloatLabel, Toast, InputText, Textarea, ToggleSwitch, Button, Avatar, DatePicker, ConfirmDialog, Message, MultiSelect
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
			isVisible: "",
			period: {},
			members: [],
			startDate: "",
			endDate: "",
			allDay: false,
			startTime: "",
			endTime: "",
			selectedParticipants: [],
			allMembers: [],
			startDateTime: "",
			endDateTime: "",
			alerts: [],
			selectedAlertTypes: [],
			alertTypes: [
				{ labelKey: 'alertTypes.10min', code: '10min' },
				{ labelKey: 'alertTypes.30min', code: '30min' },
				{ labelKey: 'alertTypes.1hour', code: '1hour' },
				{ labelKey: 'alertTypes.4hours', code: '4hours' },
				{ labelKey: 'alertTypes.24hours', code: '24hours' },
			],
			translatedAlertTypes: [],
			updatedAlerts: [],
			areValidDates: true,
			errorMessage: ""
		}
	},
	computed: {
		isSubmitEventButtonDisabled() {
			return (!this.name || this.selectedParticipants.length === 0);
		},
		isSubmitPeriodButtonDisabled() {
			return (!this.startDate || !this.endDate || !this.areValidDates);
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

					this.setIsChecked();
					this.getAllFamilyMembers();
					this.setDateTime();
					this.setAlerts();
				} catch (error) {
					this.event = null;
					console.error('Erreur:', error);
				}
			}
		},
		setIsChecked() {
			if (this.isVisible) {
				this.checked = false;
			} else {
				this.checked = true;
			}
		},
		async submitUpdateEvent() {
			// Empêcher l'envoi si le formulaire n'est pas valide
			if (this.isSubmitEventButtonDisabled) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: "Le formulaire contient des erreurs. Veuillez vérifier les champs.",
					life: 5000
				});
				return;
			}

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
			if (this.checked) {
				this.isVisible = false;
			} else {
				this.isVisible = true;
			}
		},
		async submitUpdatePeriod() {
			// Empêcher l'envoi si le formulaire n'est pas valide
			if (this.isSubmitPeriodButtonDisabled) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: "Le formulaire contient des erreurs. Veuillez vérifier les champs.",
					life: 5000
				});
				return;
			}

			const periodValidation = {
				startDate: this.startDate,
				endDate: this.endDate,
				startTime: this.startTime,
				endTime: this.endTime,
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

			this.setPeriod();

			const periodDetails = {
				startDateTime: this.startDateTime,
				endDateTime: this.endDateTime,
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
		setPeriod() {
			this.startDateTime = this.combineDateTime(this.startDate, this.startTime);
			this.endDateTime = this.combineDateTime(this.endDate, this.endTime);
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
			// Vérification que `date` est un objet Date valide
			if (!(date instanceof Date) || isNaN(date)) {
				console.error('Date invalide:', date);
				return null;
			}

			let hours, minutes;

			// Gestion de `time` selon son type
			if (typeof time === 'string') {
				// Si `time` est une chaîne au format "HH:mm"
				const timeParts = time.split(':');
				if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
					console.error('Heure invalide (chaîne) :', time);
					return null;
				}
				hours = parseInt(timeParts[0], 10);
				minutes = parseInt(timeParts[1], 10);
			} else if (time instanceof Date && !isNaN(time)) {
				// Si `time` est un objet `Date`
				hours = time.getHours();
				minutes = time.getMinutes();
			} else {
				console.error('Heure invalide :', time);
				return null;
			}

			// Formatage de la partie date
			const datePart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // YYYY-MM-DD

			// Combinaison de la date et de l'heure
			const combinedDate = new Date(`${datePart}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

			return combinedDate; // Retourne un objet Date
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
				}

				// Ajouter les membres de `members` à `selectedParticipants` par défaut
				this.members.forEach(member => {
					if (!this.selectedParticipants.includes(member.id)) {
						this.selectedParticipants.push(member.id);
					}
				});

			} catch (error) {
				console.error('Erreur:', error);
			}
		},
		setDateTime() {
			this.startDate = new Date(this.period.startDateTime);
			this.endDate = new Date(this.period.endDateTime);

			// Formate l'heure en HH:mm
			this.startTime = this.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
			this.endTime = this.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
		},
		setAlerts() {
			this.alerts = this.period.alerts;
			this.selectedAlertTypes = [];

			// Parcours des alertes existantes
			this.alerts.forEach(alert => {
				const alertDateTime = new Date(alert.dateTime);
				const startDateTime = new Date(this.startDate);

				// Calcul de la différence en minutes entre l'alerte et le début
				const diffInMinutes = Math.round((startDateTime - alertDateTime) / (1000 * 60));

				// Vérifie à quel type d'alerte cette différence correspond
				const matchingAlertType = this.alertTypes.find(type => {
					switch (type.code) {
						case '10min': return diffInMinutes === 10;
						case '30min': return diffInMinutes === 30;
						case '1hour': return diffInMinutes === 60;
						case '4hours': return diffInMinutes === 240;
						case '24hours': return diffInMinutes === 1440;
						default: return false;
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
						message: this.$t('deleteEventConfirm'),
						icon: 'pi pi-info-circle',
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
	},
	watch: {
		'$i18n.locale': {
			handler() {
				this.updateTranslatedAlertTypes(); // Mettre à jour la liste des types d'alertes
			},
			immediate: true // Met à jour dès que le composant est monté
		}
	},

}

</script>