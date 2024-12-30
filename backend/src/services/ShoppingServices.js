const ShoppingQueries = require("../queries/ShoppingQueries");

class ShoppingServices {
	static async deleteItem(itemId) {
		await ShoppingQueries.deleteItem(itemId);
	}

	static async deleteShoppingList(shoppingListId) {
		await ShoppingQueries.deleteShoppingList(shoppingListId);
	}

	static async getItemById(itemId) {
		const result = await ShoppingQueries.getItemById(itemId);
		if (result) {
			return {
				id: itemId,
				name: result.name,
				isChecked: result.is_checked,
				shoppingListId: result.id_shopping_list
			};
		}

		return undefined;
	}

	static async getItemsByShoppingListId(shoppingListId) {
		const result = await ShoppingQueries.getItemsByShoppingListId(shoppingListId);

		if (result) {
			const items = [];
			for (const item of result) {
				items.push({
					id: item.id_shopping_item,
					name: item.name,
					isChecked: item.is_checked
				});
			}
			return items
		}

		return undefined;
	}

	static async getShoppingListById(shoppingListId) {
		const result = await ShoppingQueries.getShoppingListById(shoppingListId);
		if (result) {
			const items = await this.getItemsByShoppingListId(shoppingListId);
			return {
				id: shoppingListId,
				name: result.name,
				items: items
			};
		}

		return undefined;
	}

	static async getShoppingLists(familyId) {
		const familyShoppingLists = await ShoppingQueries.getShoppingLists(familyId);
		const shoppingLists = [];

		for (const shoppingList of familyShoppingLists) {
			shoppingLists.push(await this.getShoppingListById(shoppingList.id_shopping_list));
		}

		return shoppingLists;
	}

	static async insertItem(item) {
		const newItemId = await ShoppingQueries.insertItem(item);
		return this.getItemById(newItemId);
	}

	static async insertShoppingList(shoppingList) {
		const newShoppingListId = await ShoppingQueries.insertShoppingList(shoppingList);
		return this.getShoppingListById(newShoppingListId);
	}

	static async isShoppingListInFamily(shoppingListId, familyId) {
		return await ShoppingQueries.isShoppingListInFamily(shoppingListId, familyId);
	}

	static async updateItem(item) {
		await ShoppingQueries.updateItem(item);
		return this.getItemById(item.id);
	}

	static async updateShoppingList(shoppingList) {
		await ShoppingQueries.updateShoppingList(shoppingList);
		return this.getShoppingListById(shoppingList.id);
	}
}

module.exports = ShoppingServices;