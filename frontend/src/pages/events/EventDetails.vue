<template>
	<div v-if="event" class="top-20 w-96 gap-3 flex flex-col pt-20 pb-16">
		<h1 class="text-3xl mb-4 text-center">{{ $t('eventDetailTitle') }}</h1>
		<form id="eventForm" class="flex flex-col gap-5 border p-3 rounded-lg" @submit.prevent="submitUpdateEvent">
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
			<div class="flex flex-col border p-3 rounded-lg gap-3">
				<p class="text-lg text-center">Participants</p>
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

			<Button :disabled="isSubmitButtonDisabled" :label="$t('buttonUpdateEvent')" raised type="submit" />
		</form>

		<form id="periodForm" class="flex flex-col gap-5 border p-3 rounded-lg" @submit.prevent="submitUpdatePeriod">
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
				<DatePicker id="startTime" v-model="startTime" timeOnly fluid />
				<DatePicker id="endTime" v-model="endTime" timeOnly fluid />
			</div>

			<Message v-if="errorMessage" class="error-message" severity="error">{{ errorMessage }}</Message>

			<Button :disabled="isSubmitButtonDisabled" :label="$t('buttonUpdatePeriod')" raised type="submit" />
		</form>
		<Button :label="$t('deleteButton')" raised severity="danger" @click="submitDeletePeriod($event)" />
		<ConfirmDialog></ConfirmDialog>
		<Toast ref="toast" position="bottom-right" />
	</div>
</template>

<script>
import { getEvent, updateEventById, updatePeriodById } from '@/services/eventServices.js';
import { getAllMembersByFamilyId } from "@/services/memberServices.js";
import { getMemberImage } from "@/services/memberServices.js";
//import { eventSchema } from "@/schemas/eventSchemas.js";
import FloatLabel from "primevue/floatlabel";
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ToggleSwitch from 'primevue/toggleswitch';
import Avatar from "primevue/avatar";
import DatePicker from 'primevue/datepicker';
import Button from "primevue/button";
import ConfirmDialog from 'primevue/confirmdialog';

export default {
	inject: ['token', 'user'],
	components: {
		FloatLabel, Toast, InputText, Textarea, ToggleSwitch, Button, Avatar, DatePicker, ConfirmDialog
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
			loading: false
		}
	},
	computed: {
		isSubmitButtonDisabled() {
			return !this.name || !this.startDate || !this.endDate || this.selectedParticipants.length === 0;
		}
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
					this.setDate();
					this.setTime();
				} catch (error) {
					this.event = null;
					console.error('Erreur:', error);
				}
			}
			this.loading = false;
		},
		setIsChecked() {
			if (this.isVisible) {
				this.checked = false;
			} else {
				this.checked = true;
			}
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
				//await eventSchema.validate(eventDetails);
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
			this.setTimeForAllDay();

			this.setPeriod();

			const periodDetails = {
				startDateTime: this.startDateTime,
				endDateTime: this.endDateTime,
				alerts: []
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

			// Convertit startDate et startTime en chaînes pour obtenir les parties de date et d'heure
			const datePart = date.toISOString().split('T')[0]; // YYYY-MM-DD

			const [hours, minutes] = time.split(':');

			// Combine les parties de date et d'heure dans un format ISO
			return new Date(`${datePart}T${hours}:${minutes}:00.000Z`).toISOString();
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
		setDate() {
			this.startDate = new Date(this.period.startDateTime);
			this.endDate = new Date(this.period.endDateTime);
		},
		setTime() {
			this.startTime = new Date(this.period.startDateTime).toISOString().split('T')[1].substring(0, 5);
			this.endTime = new Date(this.period.endDateTime).toISOString().split('T')[1].substring(0, 5);
		},
	},
	mounted() {
		this.getEventWithToken();
	},
	watch: {
		startDate(newStartDate) {
			if (!this.endDate || this.endDate < this.startDate) {
				this.endDate = newStartDate;
			}
		},
		endDate(newEndDate) {
			if (this.endDate < this.startDate) {
				this.startDate = newEndDate;
			}
		},
		startTime(newStartTime) {
			if (this.startTime > this.endTime) {
				const endTime = new Date(newStartTime);
				endTime.setHours(endTime.getHours() + 1);
				this.endTime = endTime;
			}
		},
		endTime(newEndTime) {
			if (newEndTime < this.startTime && this.startDate === this.endDate) {
				const startTime = new Date(newEndTime);
				startTime.setHours(startTime.getHours() - 1);
				this.startTime = startTime;
			}
		}
	}

}

</script>