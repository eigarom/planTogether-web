<template>
	<div class="inline-flex items-center gap-3">
		<Checkbox v-model="isChecked" binary class="w-5 h-5" @change="switchChecked"/>

		<p
			:class="{ 'line-through text-gray-500': isChecked }"
			class="cursor-pointer flex-grow"
			@click="showEditTaskDialog = true"
		>
			{{ name }}
		</p>

		<i class="pi pi-times cursor-pointer" @click="deleteTask"></i>
	</div>

	<!-- Éditer la tâche -->
	<Dialog
		v-model:visible="showEditTaskDialog"
		:header="$t('editTaskTitle')"
		class="w-full sm:w-80 mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="editTask">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="name" class="w-full"/>
				<label for="name">{{ $t('taskName') }}</label>
			</FloatLabel>

			<FloatLabel variant="on">
				<Textarea id="description" v-model.trim="description" class="w-full"/>
				<label for="description">{{ $t('taskDescription') }}</label>
			</FloatLabel>

			<Button :disabled="isEditTaskSubmitButtonDisabled" :label="$t('buttonEditTask')" type="submit"
					@click="this.showEditTaskDialog = false;"/>
		</form>
	</Dialog>

	<Toast ref="toast" :pt="{root: { style: 'width: 90% ; max-width: 400px' }}" position="bottom-right"/>
</template>

<script>
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import {taskSchema} from "@/schemas/taskSchemas.js";
import {deleteTask, updateTask} from "@/services/tasksListsService.js";
import Toast from "primevue/toast";

export default {
	inject: ['token'],
	components: {
		Toast, InputText, Textarea, FloatLabel, Button, Dialog, Checkbox
	},
	props: {
		task: {
			type: Object,
			required: true
		},
		tasksListId: {
			type: Number,
			required: true
		}
	},
	emits: ['taskDeleted'],
	data: () => {
		return {
			id: '',
			name: '',
			description: '',
			isChecked: '',
			showEditTaskDialog: false,
			initialName: '',
			initialDescription: ''
		};
	},
	computed: {
		isEditTaskSubmitButtonDisabled() {
			return this.name === '' || (this.name === this.initialName && this.description ===
				this.initialDescription);
		}
	},
	methods: {
		async editTask() {
			const task = {
				name: this.name,
				description: this.description,
				isChecked: this.isChecked
			}

			try {
				await taskSchema.validate(task);
				await updateTask(this.token, this.tasksListId, task, this.id);

				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastEditTaskSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('editTaskErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});

				console.error(err);
			}
		},
		async switchChecked() {
			await this.editTask();
		},
		async deleteTask() {
			try {
				await deleteTask(this.token, this.tasksListId, this.id);
				this.$emit('taskDeleted', this.id);

			} catch {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('deleteTaskErrorMessage'),
					life: 5000
				});
			}
		}
	},
	created() {
		this.id = this.task.id;
		this.name = this.task.name;
		this.description = this.task.description;
		this.isChecked = this.task.isChecked;
		this.initialName = this.task.name;
		this.initialDescription = this.task.description;
	}
};
</script>