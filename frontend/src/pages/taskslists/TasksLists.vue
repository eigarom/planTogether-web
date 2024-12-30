<template>
	<div v-if="!isLoading" class="flex flex-col gap-3 min-h-fit w-full p-5 sm:p-0">

		<!-- En-tête -->
		<div class="inline-flex justify-between items-start">
			<h1 class="text-2xl">{{ $t('tasksListsTitle') }}</h1>

			<Button v-if="this.tasksLists.length > 0"
					class="p-button-rounded p-button-sm"
					icon="pi pi-plus"
					severity="info"
					@click="showNewTasksListDialog = true"
			/>
		</div>

		<!-- Contenu principal -->

		<!-- Si aucune liste de tâches -->
		<div v-if="this.tasksLists.length === 0" class="w-full flex justify-center">
			<div class="w-fit mt-28 flex flex-col items-center  gap-5 border rounded-lg bg-white p-5">
				<p class="text-xl">{{ $t('noTasksListsTitle') }}</p>

				<Button
					:label="$t('buttonAddTasksList')"
					class=" "
					severity="info"
					@click="showNewTasksListDialog = true"
				/>
			</div>
		</div>

		<!-- Si des listes de tâches -->
		<div v-else class="flex flex-wrap gap-5">
			<TasksListsItem v-for="tasksList in sortedTasksLists" :key="tasksList.id" :tasksList="tasksList"
							@tasksListDeleted="removeTasksList" @tasksListUpdated="updateTasksList"/>
		</div>
	</div>

	<!--Créer une liste de tâches-->
	<Dialog
		v-model:visible="showNewTasksListDialog"
		:header="$t('addTaskListTitle')"
		class="w-full sm:w-80 mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="addTasksList">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="newTasksListName" class="w-full"/>
				<label for="name">{{ $t('tasksListName') }}</label>
			</FloatLabel>

			<Button :disabled="isAddTasksListSubmitButtonDisabled" :label="$t('buttonAddTasksList')"
					type="submit"
					@click="showNewTasksListDialog = false"/>
		</form>
	</Dialog>

	<Toast ref="toast" position="bottom-right"/>
</template>

<script>

import {createTasksList, getTasksLists} from "@/services/tasksListsService.js";
import TasksListsItem from "./TaskListItem.vue";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import {tasksListSchema} from "@/schemas/taskSchemas.js";
import Toast from "primevue/toast";

export default {
	inject: ['token',],
	components: {TasksListsItem, Button, Dialog, InputText, FloatLabel, Toast},
	data: () => {
		return {
			tasksLists: [],
			showNewTasksListDialog: false,
			newTasksListName: '',
			isLoading: true
		};
	},
	computed: {
		isAddTasksListSubmitButtonDisabled() {
			return !this.newTasksListName;
		},
		sortedTasksLists() {
			return this.tasksLists.sort((a, b) => a.name.localeCompare(b.name));
		}
	},
	methods: {
		async initializeTasksLists() {
			try {
				this.tasksLists = await getTasksLists(this.token);
				this.tasksLists.sort((a, b) => a.name.localeCompare(b.name));
			} catch (error) {
				console.error(error);
			}
		},
		async addTasksList() {
			const tasksList = {
				name: this.newTasksListName
			}

			try {
				await tasksListSchema.validate(tasksList);
				const newTasksList = await createTasksList(this.token, tasksList);
				this.tasksLists.push(newTasksList);
				this.newTasksListName = '';
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastAddTasksListSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('addTasksListErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		removeTasksList(id) {
			this.tasksLists = this.tasksLists.filter(tasksList => tasksList.id !== id);
			this.$refs.toast.add({
				severity: 'success',
				summary: this.$t('toastSuccessTitle'),
				detail: this.$t('toastDeleteTasksListSuccessMessage'),
				life: 3000
			});
		},
		updateTasksList(updatedTasksList) {
			const index = this.tasksLists.findIndex(tasksList => tasksList.id === updatedTasksList.id);
			this.tasksLists[index] = updatedTasksList;
		}
	},
	created() {
		this.initializeTasksLists();
		this.isLoading = false;
	}
};
</script>