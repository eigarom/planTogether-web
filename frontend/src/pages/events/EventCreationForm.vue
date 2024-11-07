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
				<div class="flex flex-col border p-3 rounded-lg gap-3">
					<p class="text-lg text-center">Participants</p>
					<div v-for="member in allMembers" :key="member.id"
						class="flex flex-inline items-center justify-between border p-3 rounded-lg"
						:class="{ 'bg-blue-100': isSelected(member) }" @click="toggleMemberSelection(member)"
						style="cursor: pointer;">
						<p>{{ member.name }}</p>
						<Avatar v-if="member.imageUrl" :image="member.imageUrl" shape="circle" size="small"
							class="border-4" :style="{ borderColor: member.color }" />
						<Avatar v-else :label="memberInitials(member)" :style="`background-color: ${member.color}`"
							class="font-semibold text-white" shape="circle" size="small" />
					</div>
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
			allMembers: [],
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

			this.setIsVisible();
			this.setPeriods();


			const eventDetails = {
				name: this.name,
				description: this.description,
				isVisible: this.isVisible,
				periods: this.periods,
				alerts: this.alerts,
				members: this.members
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
		setIsVisible() {
			if (this.checked) {
				this.isVisible = false;
			} else {
				this.isVisible = true;
			}
		},
		setPeriods() {
			this.setTimeForAllDay();

			const initialStartDateTime = this.combineDateTime(this.startDate, this.startTime);
			const initialEndDateTime = this.combineDateTime(this.endDate, this.endTime);

			const newPeriod = { "startDateTime": initialStartDateTime, "endDateTime": initialEndDateTime }

			this.periods.push(newPeriod);

			if (this.selectedFrequency.code !== 'none') {
				this.handleFrequency(this.selectedFrequency.code, initialStartDateTime, initialEndDateTime);
			}
		},
		setTimeForAllDay() {
			if (this.allDay) {
				this.startTime = "00:00";
				this.endTime = "23:59";
			}
		},
		combineDateTime(date, time) {
			if (!date || !time) return null; // Vérifie si les deux valeurs existent

			// Convertit startDate et startTime en chaînes pour obtenir les parties de date et d'heure
			const datePart = date.toISOString().split('T')[0]; // YYYY-MM-DD
			const [hours, minutes] = time.split(':'); // HH:mm du format HH:mm

			// Combine les parties de date et d'heure dans un format ISO
			return new Date(`${datePart}T${hours}:${minutes}:00.000Z`).toISOString();
		},
		handleFrequency(frequencyCode, initialStartDateTime, initialEndDateTime) {
			const newStartDate = new Date(initialStartDateTime);
			const newEndDate = new Date(initialEndDateTime);

			switch (frequencyCode) {
				case 'daily':
					for (let i = 0; i < this.numberRepeats; i++) {
						newStartDate.setDate(newStartDate.getDate() + 1);
						newEndDate.setDate(newEndDate.getDate() + 1);
						const newPeriod = { "startDateTime": newStartDate, "endDateTime": newEndDate }
						this.periods.push(newPeriod);
					}
					break;
				case 'weekly':
					for (let i = 0; i < this.numberRepeats; i++) {
						newStartDate.setDate(newStartDate.getDate() + 7);
						newEndDate.setDate(newEndDate.getDate() + 7);
						const newPeriod = { "startDateTime": newStartDate, "endDateTime": newEndDate }
						this.periods.push(newPeriod);
					}
					break;
				case 'monthly':
					for (let i = 0; i < this.numberRepeats; i++) {
						newStartDate.setMonth(newStartDate.getMonth() + 1);
						newEndDate.setMonth(newEndDate.getMonth() + 1);
						const newPeriod = { "startDateTime": newStartDate, "endDateTime": newEndDate }
						this.periods.push(newPeriod);
					}
					break;
				case 'annual':
					for (let i = 0; i < this.numberRepeats; i++) {
						newStartDate.setFullYear(newStartDate.getFullYear() + 1);
						newEndDate.setFullYear(newEndDate.getFullYear() + 1);
						const newPeriod = { "startDateTime": newStartDate, "endDateTime": newEndDate }
						this.periods.push(newPeriod);
					}
					break;
				default:
					console.log("Fréquence non reconnue");
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
		}
	},
	mounted() {
		this.setPlaceholderStartTime();
		this.setPlaceholderEndTime();
		this.getAllFamilyMembers();
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