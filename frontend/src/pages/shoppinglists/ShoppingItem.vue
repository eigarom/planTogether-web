<template>
	<div class="inline-flex items-center gap-3">
		<Checkbox v-model="isChecked" binary class="w-5 h-5" @change="switchChecked"/>

		<input
			v-model="name"
			:class="{ 'line-through text-gray-500': isChecked }"
			class="flex-grow outline-none pl-1"
			type="text"
			@blur="editItem"
		/>

		<i class="pi pi-times cursor-pointer" @click="deleteItem"></i>
	</div>

	<Toast ref="toast" position="bottom-right"/>
</template>

<script>
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import {shoppingItemSchema} from "@/schemas/shoppingSchemas.js";
import {deleteItem, updateItem} from "@/services/shoppingListsService.js";
import Toast from "primevue/toast";

export default {
	inject: ['token'],
	components: {
		Toast, InputText, Textarea, FloatLabel, Button, Checkbox
	},
	props: {
		item: {
			type: Object,
			required: true
		},
		shoppingListId: {
			type: Number,
			required: true
		}
	},
	emits: ['itemDeleted'],
	data: () => {
		return {
			id: '',
			name: '',
			isChecked: '',
			showEditItemDialog: false,
			initialName: ''
		};
	},
	methods: {
		async editItem() {
			if (this.name === this.initialName && this.isChecked === this.item.isChecked)
				return;

			const item = {
				name: this.name,
				isChecked: this.isChecked
			}

			try {
				await shoppingItemSchema.validate(item);
				await updateItem(this.token, this.shoppingListId, item, this.id);
				this.initialName = this.name;

				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastEditItemSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('editItemErrorMessage');
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
			await this.editItem();
		},
		async deleteItem() {
			try {
				await deleteItem(this.token, this.shoppingListId, this.id);
				this.$emit('itemDeleted', this.id);

			} catch (err) {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('deleteItemErrorMessage'),
					life: 5000
				});
			}
		}
	},
	created() {
		this.id = this.item.id;
		this.name = this.item.name;
		this.isChecked = this.item.isChecked;
		this.initialName = this.item.name;
	}
};
</script>