<template>
	<div v-if="!isLoading" class="flex flex-col gap-3 min-h-fit w-full p-5 sm:p-0">

		<!-- En-tête -->
		<div class="inline-flex justify-between items-start">
			<h1 class="text-2xl">{{ $t('shoppingListsTitle') }}</h1>

			<Button v-if="this.shoppingLists.length > 0"
					class="p-button-rounded p-button-sm"
					icon="pi pi-plus"
					severity="info"
					@click="showNewShoppingListDialog = true"
			/>
		</div>

		<!-- Contenu principal -->

		<!-- Si aucune liste de courses -->
		<div v-if="this.shoppingLists.length === 0" class="w-full flex justify-center">
			<div class="w-fit mt-28 flex flex-col items-center  gap-5 border rounded-lg bg-white p-5">
				<p class="text-xl">{{ $t('noShoppingListsTitle') }}</p>

				<Button
					:label="$t('buttonAddShoppingList')"
					class=" "
					severity="info"
					@click="showNewShoppingListDialog = true"
				/>
			</div>
		</div>

		<!-- Si des listes de courses -->
		<div v-else class="flex flex-wrap gap-5">
			<ShoppingListsItem v-for="shoppingList in sortedShoppingLists" :key="shoppingList.id"
							   :shoppingList="shoppingList"
							   @shoppingListDeleted="removeShoppingList" @shoppingListUpdated="updateShoppingList"/>
		</div>
	</div>

	<!--Créer une liste de courses-->
	<Dialog
		v-model:visible="showNewShoppingListDialog"
		:header="$t('addShoppingListTitle')"
		class="w-full sm:w-80 mx-5"
		modal
	>
		<form id="profileForm" class="flex flex-col gap-4 pt-2" @submit.prevent="addShoppingList">
			<FloatLabel class="pb-[6px]" variant="on">
				<InputText id="name" v-model.trim="newShoppingListName" class="w-full"/>
				<label for="name">{{ $t('shoppingListName') }}</label>
			</FloatLabel>

			<Button :disabled="isAddShoppingListSubmitButtonDisabled" :label="$t('buttonAddShoppingList')"
					type="submit"
					@click="showNewShoppingListDialog = false"/>
		</form>
	</Dialog>

	<Toast ref="toast" position="bottom-right"/>
</template>

<script>

import ShoppingListsItem from "./ShoppingListItem.vue";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import {shoppingListSchema} from "@/schemas/shoppingSchemas.js";
import Toast from "primevue/toast";
import {createShoppingList, getShoppingLists} from "@/services/shoppingListsService.js";

export default {
	inject: ['token',],
	components: {ShoppingListsItem, Button, Dialog, InputText, FloatLabel, Toast},
	data: () => {
		return {
			shoppingLists: [],
			showNewShoppingListDialog: false,
			newShoppingListName: '',
			isLoading: true
		};
	},
	computed: {
		isAddShoppingListSubmitButtonDisabled() {
			return !this.newShoppingListName;
		},
		sortedShoppingLists() {
			return this.shoppingLists.sort((a, b) => a.name.localeCompare(b.name));
		}
	},
	methods: {
		async initializeShoppingLists() {
			try {
				this.shoppingLists = await getShoppingLists(this.token);
				this.shoppingLists.sort((a, b) => a.name.localeCompare(b.name));
			} catch (error) {
				console.error(error);
			}
		},
		async addShoppingList() {
			const shoppingList = {
				name: this.newShoppingListName
			}

			try {
				await shoppingListSchema.validate(shoppingList);
				const newShoppingList = await createShoppingList(this.token, shoppingList);
				this.shoppingLists.push(newShoppingList);
				this.newShoppingListName = '';
				this.$refs.toast.add({
					severity: 'success',
					summary: this.$t('toastSuccessTitle'),
					detail: this.$t('toastAddShoppingListSuccessMessage'),
					life: 3000
				});
			} catch (err) {
				if (err.name === 'ValidationError') {
					this.errorMessage = err.message;
				} else {
					this.errorMessage = this.$t('addShoppingListErrorMessage');
				}

				this.$refs.toast.add({
					severity: 'error',
					summary: this.$t('toastErrorTitle'),
					detail: this.errorMessage,
					life: 5000
				});
			}
		},
		removeShoppingList(id) {
			this.shoppingLists = this.shoppingLists.filter(shoppingList => shoppingList.id !== id);
			this.$refs.toast.add({
				severity: 'success',
				summary: this.$t('toastSuccessTitle'),
				detail: this.$t('toastDeleteShoppingListSuccessMessage'),
				life: 3000
			});
		},
		updateShoppingList(updatedShoppingList) {
			const index = this.shoppingLists.findIndex(shoppingList => shoppingList.id === updatedShoppingList.id);
			this.shoppingLists[index] = updatedShoppingList;
		}
	},
	created() {
		this.initializeShoppingLists();
		this.isLoading = false;
	}
};
</script>