<template>
	<div class="flex flex-col w-full sm:w-80 border rounded-lg pt-2 bg-white h-fit">

		<!-- En-tête -->
		<h2 class="pl-5 text-xl cursor-pointer w-full" @click="showEditDialog = true">{{ shoppingList.name }}</h2>

		<Divider class="custom-divider"/>

		<!-- Ajouter un produit -->
		<input v-model.trim="newItemName" :placeholder="$t('addItemPlaceholder')"
			   class="flex-grow outline-none px-5 pb-2" type="text" @keyup.enter="addItem"/>

		<!-- Liste de courses -->
		<div class="flex flex-col gap-3 px-5 pb-5">
			<ShoppingItem v-for="item in sortedItems" :key="item.id" :item="item" :shoppingListId="shoppingList.id"
						  @itemDeleted="removeItem"/>
		</div>
	</div>

	<!--Modifier liste de courses-->
	<Dialog
		v-model:visible="showEditDialog"
		:header="$t('editShoppingListTitle')"
		class="w-full sm:w-fit mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="editShoppingList">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="name" class="w-full"/>
				<label for="name">{{ $t('shoppingListName') }}</label>
			</FloatLabel>

			<div class="flex flex-col sm:flex-row gap-5">
				<Button :disabled="isEditShoppingListSubmitButtonDisabled" :label="$t('buttonEditShoppingList')"
						type="submit" @click="showEditDialog=false"/>
				<Button :label="$t('buttonDeleteShoppingList')" severity="danger"
						@click="showEditDialog=false; deleteShoppingList()"/>
			</div>
		</form>
	</Dialog>

	<Toast ref="toast" position="bottom-right"/>
</template>

<script>

import Divider from "primevue/divider";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import {shoppingItemSchema, shoppingListSchema} from "@/schemas/shoppingSchemas.js";
import {createItem, deleteShoppingList, updateShoppingList} from "@/services/shoppingListsService.js";
import Toast from "primevue/toast";
import ShoppingItem from "@/pages/shoppinglists/ShoppingItem.vue";

export default {
	inject: ['token'],
	components: {
		Toast, InputText, FloatLabel, ShoppingItem, Divider, Button, Dialog
	},
	props: {
		shoppingList: {
			type: Object,
			required: true
		}
	},
	emits: ['shoppingListDeleted', 'shoppingListUpdated'],
	data: () => {
		return {
			showEditDialog: false,
			name: '',
			initialName: '',
			showNewItemDialog: false,
			newItemName: ''
		};
	},
	computed: {
		isEditShoppingListSubmitButtonDisabled() {
			return this.shoppingList.name === '' || this.name === this.initialName;
		},
		sortedItems() {
			return this.shoppingList.items.slice().sort((a, b) => a.name.localeCompare(b.name));
		}
	},
	methods: {
		async addItem() {
			const item = {
				name: this.newItemName,
				isChecked: false
			}

			try {
				await shoppingItemSchema.validate(item);

				const newItem = await createItem(this.token, this.shoppingList.id, item);

				const updatedShoppingList = {
					...this.shoppingList,
					items: [...this.shoppingList.items, newItem]
				};

				this.$emit('shoppingListUpdated', updatedShoppingList);

				this.newItemName = '';

				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastAddItemSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('addItemErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		async editShoppingList() {
			this.showEditDialog = false;

			const shoppingList = {
				name: this.name
			}

			try {
				await shoppingListSchema.validate(shoppingList);
				await updateShoppingList(this.token, shoppingList, this.shoppingList.id);

				const updatedShoppingList = {
					...this.shoppingList,
					name: this.name
				};

				this.$emit('shoppingListUpdated', updatedShoppingList);

				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastEditShoppingListSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('editShoppingListErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		async deleteShoppingList() {
			try {
				await deleteShoppingList(this.token, this.shoppingList.id);
				this.$emit('shoppingListDeleted', this.shoppingList.id);

			} catch {
				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.$t('deleteShoppingListErrorMessage'),
					life: 5000
				});
			}
		},
		removeItem(id) {
			const updatedShoppingList = {
				...this.shoppingList, items: this.shoppingList.items.filter(item => item.id !== id)
			};
			this.$emit('shoppingListUpdated', updatedShoppingList);

			this.$refs.toast.add({
				severity: 'success',
				summary: this.$t('toastSuccessTitle'),
				detail: this.$t('toastDeleteItemSuccessMessage'),
				life: 3000
			});
		}
	},
	created() {
		this.name = this.shoppingList.name;
		this.initialName = this.shoppingList.name;
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