<template>
	<div class="flex flex-col w-full sm:w-80 border rounded-lg pt-2 bg-white h-fit">

		<!-- En-tête -->
		<div class="inline-flex justify-between items-center px-5">
			<h2 class="text-xl cursor-pointer w-full" @click="showEditDialog = true">{{ tasksList.name }}</h2>

			<Button
				class="p-button-rounded p-button-outlined p-button-sm"
				icon="pi pi-plus"
				severity="info"
				@click="showNewTaskDialog = true"
			/>
		</div>

		<Divider class="custom-divider"/>

		<!-- Liste de tâches -->
		<div class="flex flex-col gap-3 px-5 pb-5">
			<TaskItem v-for="task in sortedTasks" :key="task.id" :task="task" :tasksListId="tasksList.id"
					  @taskDeleted="removeTask"/>
		</div>
	</div>

	<!--Créer une tâche-->
	<Dialog
		v-model:visible="showNewTaskDialog"
		:header="$t('addTaskTitle')"
		class="w-full sm:w-80 mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="addTask">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="newTaskName" class="w-full"/>
				<label for="name">{{ $t('taskName') }}</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<Textarea id="description" v-model.trim="newTaskDescription" class="w-full"/>
				<label for="description">{{ $t('taskDescription') }}</label>
			</FloatLabel>

			<Button :disabled="isAddTaskSubmitButtonDisabled" :label="$t('buttonAddTask')" type="submit"
					@click="showNewTaskDialog = false"/>
		</form>
	</Dialog>

	<!--Modifier liste de tâches-->
	<Dialog
		v-model:visible="showEditDialog"
		:header="$t('editTaskListTitle')"
		class="w-full sm:w-fit mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="editTaskList">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="tasksList.name" class="w-full"/>
				<label for="name">{{ $t('tasksListName') }}</label>
			</FloatLabel>

			<div class="flex flex-col sm:flex-row gap-5">
				<Button :disabled="isEditTasksListSubmitButtonDisabled" :label="$t('buttonEditTaskList')"
						type="submit" @click="showEditDialog=false"/>
				<Button :label="$t('buttonDeleteTasksList')" severity="danger"
						@click="showEditDialog=false; deleteTasksList()"/>
			</div>
		</form>
	</Dialog>

	<Toast ref="toast" position="bottom-right"/>
</template>

<script>

import Divider from "primevue/divider";
import TaskItem from "./TaskItem.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import ColorPicker from "primevue/colorpicker";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import {taskSchema, tasksListSchema} from "@/schemas/taskSchemas.js";
import {createTask, deleteTasksList, updateTasksList} from "@/services/tasksListsService.js";
import Toast from "primevue/toast";

export default {
	inject: ['token'],
	components: {
		Toast, InputText, ColorPicker, FloatLabel, TaskItem, Divider, Button, Dialog, Textarea
	},
	props: {
		tasksList: {
			type: Object,
			required: true
		}
	},
	emits: ['tasksListDeleted', 'tasksListUpdated'],
	data: () => {
		return {
			showEditDialog: false,
			showNewTaskDialog: false,
			newTaskName: '',
			newTaskDescription: '',
			initialTasksListName: ''
		};
	},
	computed: {
		isAddTaskSubmitButtonDisabled() {
			return this.newTaskName === '';
		},
		isEditTasksListSubmitButtonDisabled() {
			return this.tasksList.name === '' || this.tasksList.name === this.initialTasksListName;
		},
		sortedTasks() {
			return this.tasksList.tasks.slice().sort((a, b) => a.name.localeCompare(b.name));
		}
	},
	methods: {
		async addTask() {
			const task = {
				name: this.newTaskName,
				description: this.newTaskDescription,
				isChecked: false
			}

			try {
				await taskSchema.validate(task);
				const newTask = await createTask(this.token, this.tasksList.id, task);
				this.tasksList.tasks.push(newTask);
				this.newTaskName = '';
				this.newTaskDescription = '';
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastAddTaskSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('addTaskErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		async editTaskList() {
			this.showEditDialog = false;

			const tasksList = {
				name: this.tasksList.name
			}

			try {
				await tasksListSchema.validate(tasksList);
				await updateTasksList(this.token, tasksList, this.tasksList.id);

				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastEditTasksListSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('editTasksListErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		async deleteTasksList() {
			try {
				await deleteTasksList(this.token, this.tasksList.id);
				this.$emit('tasksListDeleted', this.tasksList.id);

			} catch (err) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('deleteTasksListErrorMessage'),
					life: 5000
				});
			}
		},
		removeTask(id) {
			const updatedTasksList = {...this.tasksList, tasks: this.tasksList.tasks.filter(task => task.id !== id)};
			this.$emit('tasksListUpdated', updatedTasksList);

			this.$refs.toast.add({
				severity: 'success',
				summary: this.$t('toastSuccessTitle'),
				detail: this.$t('toastDeleteTaskSuccessMessage'),
				life: 3000
			});
		}
	},
	created() {
		this.initialTasksListName = this.tasksList.name;
	}
};
</script>

<style scoped>
.custom-divider {
	margin-top: 8px;
	margin-bottom: 16px;
	padding: 0;
}
</style>