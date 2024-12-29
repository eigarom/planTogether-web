const pool = require("./dbPool");

class ShoppingQueries {
	static async deleteItem(itemId) {
		await pool.query(
			`DELETE
             FROM shopping_item
             WHERE id_shopping_item = $1`,
			[itemId]
		);
	}

	static async deleteShoppingList(shoppingListId) {
		await pool.query(
			`DELETE
             FROM shopping_list
             WHERE id_shopping_list = $1`,
			[shoppingListId]
		);
	}

	static async getItemById(itemId) {
		const result = await pool.query(
			`SELECT name, is_checked, id_shopping_list
             FROM shopping_item
             WHERE id_shopping_item = $1`,
			[itemId]
		);
		return result.rows[0];
	}

	static async getItemsByShoppingListId(shoppingListId) {
		const result = await pool.query(
			`SELECT id_shopping_item, name, is_checked
             FROM shopping_item
             WHERE id_shopping_list = $1
             ORDER BY name`,
			[shoppingListId]
		);
		return result.rows;
	}

	static async getShoppingListById(shoppingListId) {
		const result = await pool.query(
			`SELECT name
             FROM shopping_list
             WHERE id_shopping_list = $1`,
			[shoppingListId]
		);
		return result.rows[0];
	}

	static async getShoppingLists(familyId) {
		const result = await pool.query(
			`SELECT id_shopping_list
             FROM shopping_list
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows;
	}

	static async insertItem(item) {
		const result = await pool.query(
			`INSERT INTO shopping_item(name, is_checked, id_shopping_list)
             VALUES ($1, $2, $3)
             RETURNING id_shopping_item`,
			[item.name, item.isChecked, item.shoppingListId]
		);
		return result.rows[0].id_shopping_item;
	}

	static async insertShoppingList(shoppingList) {
		const result = await pool.query(
			`INSERT INTO shopping_list(name, id_family)
             VALUES ($1, $2)
             RETURNING id_shopping_list`,
			[shoppingList.name, shoppingList.familyId]
		);
		return result.rows[0].id_shopping_list;
	}

	static async isShoppingListInFamily(shoppingListId, familyId) {
		const result = await pool.query(
			`SELECT id_shopping_list
             FROM shopping_list
             WHERE id_shopping_list = $1
               AND id_family = $2`,
			[shoppingListId, familyId]
		);
		return result.rows.length > 0;
	}

	static async updateItem(item) {
		const result = await pool.query(
			`UPDATE shopping_item
             SET name       = $1,
                 is_checked = $2
             WHERE id_shopping_item = $3
             RETURNING id_shopping_item`,
			[item.name, item.isChecked, item.id]
		);
		return result.rows[0].id_shopping_item;
	}

	static async updateShoppingList(shoppingList) {
		const result = await pool.query(
			`UPDATE shopping_list
             SET name = $1
             WHERE id_shopping_list = $2
             RETURNING id_shopping_list`,
			[shoppingList.name, shoppingList.id]
		);
		return result.rows[0].id_shopping_list;
	}
}

module.exports = ShoppingQueries;
