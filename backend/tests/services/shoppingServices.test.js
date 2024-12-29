const ShoppingServices = require('../../src/services/ShoppingServices');

jest.mock('../../src/queries/ShoppingQueries');
const mockShoppingQueries = require('../../src/queries/ShoppingQueries');

describe('ShoppingServices', () => {

	describe('deleteItem', () => {
		it('should call deleteItem query with the correct itemId', async () => {
			const itemId = 'itemIdTest';

			await ShoppingServices.deleteItem(itemId);

			expect(mockShoppingQueries.deleteItem).toHaveBeenCalledWith(itemId);
		});
	});

	describe('deleteShoppingList', () => {
		it('should call deleteShoppingList query with the correct shoppingListId', async () => {
			const shoppingListId = 'shoppingListIdTest';

			await ShoppingServices.deleteShoppingList(shoppingListId);

			expect(mockShoppingQueries.deleteShoppingList).toHaveBeenCalledWith(shoppingListId);
		});
	});

	describe('getItemById', () => {
		it('should return the correct item if found', async () => {
			const itemId = 'itemIdTest';
			const mockResult = {
				name: 'Milk',
				is_checked: false,
				id_shopping_list: 'list123',
			};
			mockShoppingQueries.getItemById.mockResolvedValue(mockResult);

			const item = await ShoppingServices.getItemById(itemId);

			expect(item).toEqual({
				id: itemId,
				name: 'Milk',
				isChecked: false,
				shoppingListId: 'list123',
			});
			expect(mockShoppingQueries.getItemById).toHaveBeenCalledWith(itemId);
		});

		it('should return undefined if item does not exist', async () => {
			const itemId = 'nonExistentId';
			mockShoppingQueries.getItemById.mockResolvedValue(undefined);

			const item = await ShoppingServices.getItemById(itemId);

			expect(item).toBeUndefined();
			expect(mockShoppingQueries.getItemById).toHaveBeenCalledWith(itemId);
		});
	});

	describe('getItemsByShoppingListId', () => {
		it('should return an array of items if found', async () => {
			const shoppingListId = 'list123';
			const mockResult = [
				{id_shopping_item: 'item1', name: 'Milk', is_checked: true},
				{id_shopping_item: 'item2', name: 'Bread', is_checked: false},
			];
			mockShoppingQueries.getItemsByShoppingListId.mockResolvedValue(mockResult);

			const items = await ShoppingServices.getItemsByShoppingListId(shoppingListId);

			expect(items).toEqual([
				{id: 'item1', name: 'Milk', isChecked: true},
				{id: 'item2', name: 'Bread', isChecked: false},
			]);
			expect(mockShoppingQueries.getItemsByShoppingListId).toHaveBeenCalledWith(shoppingListId);
		});

		it('should return undefined if no items are found', async () => {
			const shoppingListId = 'listX';
			mockShoppingQueries.getItemsByShoppingListId.mockResolvedValue(undefined);

			const items = await ShoppingServices.getItemsByShoppingListId(shoppingListId);

			expect(items).toBeUndefined();
			expect(mockShoppingQueries.getItemsByShoppingListId).toHaveBeenCalledWith(shoppingListId);
		});
	});

	describe('getShoppingListById', () => {
		it('should return the shopping list and its items if found', async () => {
			const shoppingListId = 'list123';
			const mockShoppingListResult = {
				name: 'Groceries',
			};
			const mockItemsResult = [
				{id_shopping_item: 'item1', name: 'Milk', is_checked: true},
				{id_shopping_item: 'item2', name: 'Bread', is_checked: false},
			];

			mockShoppingQueries.getShoppingListById.mockResolvedValue(mockShoppingListResult);
			mockShoppingQueries.getItemsByShoppingListId.mockResolvedValue(mockItemsResult);

			const shoppingList = await ShoppingServices.getShoppingListById(shoppingListId);

			expect(shoppingList).toEqual({
				id: 'list123',
				name: 'Groceries',
				items: [
					{id: 'item1', name: 'Milk', isChecked: true},
					{id: 'item2', name: 'Bread', isChecked: false},
				],
			});
			expect(mockShoppingQueries.getShoppingListById).toHaveBeenCalledWith(shoppingListId);
			expect(mockShoppingQueries.getItemsByShoppingListId).toHaveBeenCalledWith(shoppingListId);
		});

		it('should return undefined if the shopping list does not exist', async () => {
			const shoppingListId = 'noList';
			mockShoppingQueries.getShoppingListById.mockResolvedValue(undefined);

			const shoppingList = await ShoppingServices.getShoppingListById(shoppingListId);

			expect(shoppingList).toBeUndefined();
			expect(mockShoppingQueries.getShoppingListById).toHaveBeenCalledWith(shoppingListId);
		});
	});

	describe('getShoppingLists', () => {
		it('should return an array of shopping lists with their items', async () => {
			const familyId = 'family123';
			const mockFamilyLists = [
				{id_shopping_list: 'listA'},
				{id_shopping_list: 'listB'},
			];
			const mockListAResult = {name: 'List A'};
			const mockListBResult = {name: 'List B'};
			const mockListAItems = [
				{id_shopping_item: 'itemA1', name: 'Cheese', is_checked: false},
			];
			const mockListBItems = [
				{id_shopping_item: 'itemB1', name: 'Ham', is_checked: true},
			];

			mockShoppingQueries.getShoppingLists.mockResolvedValue(mockFamilyLists);
			mockShoppingQueries.getShoppingListById
				.mockResolvedValueOnce(mockListAResult)
				.mockResolvedValueOnce(mockListBResult);
			mockShoppingQueries.getItemsByShoppingListId
				.mockResolvedValueOnce(mockListAItems)
				.mockResolvedValueOnce(mockListBItems);

			const shoppingLists = await ShoppingServices.getShoppingLists(familyId);

			expect(shoppingLists).toEqual([
				{
					id: 'listA',
					name: 'List A',
					items: [
						{
							id: 'itemA1',
							name: 'Cheese',
							isChecked: false,
						},
					],
				},
				{
					id: 'listB',
					name: 'List B',
					items: [
						{
							id: 'itemB1',
							name: 'Ham',
							isChecked: true,
						},
					],
				},
			]);
			expect(mockShoppingQueries.getShoppingLists).toHaveBeenCalledWith(familyId);
		});

		it('should return an empty array if no shopping lists are found for the family', async () => {
			const familyId = 'familyWithoutLists';
			mockShoppingQueries.getShoppingLists.mockResolvedValue([]);

			const shoppingLists = await ShoppingServices.getShoppingLists(familyId);

			expect(shoppingLists).toEqual([]);
			expect(mockShoppingQueries.getShoppingLists).toHaveBeenCalledWith(familyId);
		});
	});

	describe('insertItem', () => {
		it('should insert a new item and return it', async () => {
			const itemData = {name: 'Eggs', shoppingListId: 'list123'};
			const newItemId = 'newItemId';
			const mockNewItem = {
				id: newItemId,
				name: 'Eggs',
				is_checked: false,
				id_shopping_list: 'list123',
			};
			const expectedItem = {
				id: newItemId,
				name: 'Eggs',
				isChecked: false,
				shoppingListId: 'list123',
			};


			mockShoppingQueries.insertItem.mockResolvedValue(newItemId);
			mockShoppingQueries.getItemById.mockResolvedValue(mockNewItem);

			const insertedItem = await ShoppingServices.insertItem(itemData);

			expect(insertedItem).toEqual(expectedItem);
			expect(mockShoppingQueries.insertItem).toHaveBeenCalledWith(itemData);
			expect(mockShoppingQueries.getItemById).toHaveBeenCalledWith(newItemId);
		});
	});

	describe('insertShoppingList', () => {
		it('should insert a new shopping list and return it', async () => {
			const listData = {name: 'Weekly Groceries', familyId: 'family123'};
			const newShoppingListId = 'newListId';
			const mockListResult = {
				id: newShoppingListId,
				name: 'Weekly Groceries',
				items: [],
			};
			const expectedList = mockListResult;

			mockShoppingQueries.insertShoppingList.mockResolvedValue(newShoppingListId);
			mockShoppingQueries.getShoppingListById.mockResolvedValue(mockListResult);
			mockShoppingQueries.getItemsByShoppingListId.mockResolvedValue([]);

			const insertedList = await ShoppingServices.insertShoppingList(listData);

			expect(insertedList).toEqual(expectedList);
		});
	});

	describe('isShoppingListInFamily', () => {
		it('should return true if the shopping list belongs to the family', async () => {
			const shoppingListId = 'list123';
			const familyId = 'family123';
			mockShoppingQueries.isShoppingListInFamily.mockResolvedValue(true);

			const result = await ShoppingServices.isShoppingListInFamily(shoppingListId, familyId);

			expect(result).toBe(true);
			expect(mockShoppingQueries.isShoppingListInFamily).toHaveBeenCalledWith(shoppingListId, familyId);
		});

		it('should return false if the shopping list does not belong to the family', async () => {
			const shoppingListId = 'listABC';
			const familyId = 'familyABC';
			mockShoppingQueries.isShoppingListInFamily.mockResolvedValue(false);

			const result = await ShoppingServices.isShoppingListInFamily(shoppingListId, familyId);

			expect(result).toBe(false);
			expect(mockShoppingQueries.isShoppingListInFamily).toHaveBeenCalledWith(shoppingListId, familyId);
		});
	});

	describe('updateItem', () => {
		it('should update item and return the updated item', async () => {
			const item = {
				id: 'itemId',
				name: 'Orange Juice',
				isChecked: true,
			};
			const mockUpdated = {
				id: 'itemId',
				name: 'Orange Juice',
				is_checked: true,
				id_shopping_list: 'list123',
			};
			const expectedUpdated = {
				id: 'itemId',
				name: 'Orange Juice',
				isChecked: true,
				shoppingListId: 'list123',
			};

			mockShoppingQueries.updateItem.mockResolvedValue(true);
			mockShoppingQueries.getItemById.mockResolvedValue(mockUpdated);

			const updatedItem = await ShoppingServices.updateItem(item);

			expect(updatedItem).toEqual(expectedUpdated);
			expect(mockShoppingQueries.updateItem).toHaveBeenCalledWith(item);
			expect(mockShoppingQueries.getItemById).toHaveBeenCalledWith(item.id);
		});
	});

	describe('updateShoppingList', () => {
		it('should update the shopping list and return it', async () => {
			const shoppingList = {
				id: 'list123',
				name: 'Updated Groceries',
			};
			const mockUpdated = {
				id: 'list123',
				name: 'Updated Groceries',
				items: [],
			};
			const expectedUpdated = {
				id: 'list123',
				name: 'Updated Groceries',
				items: [],
			};

			mockShoppingQueries.updateShoppingList.mockResolvedValue(true);
			mockShoppingQueries.getShoppingListById.mockResolvedValue(mockUpdated);
			mockShoppingQueries.getItemsByShoppingListId.mockResolvedValue([]);

			const updatedList = await ShoppingServices.updateShoppingList(shoppingList);

			expect(updatedList).toEqual(expectedUpdated);
			expect(mockShoppingQueries.updateShoppingList).toHaveBeenCalledWith(shoppingList);
			expect(mockShoppingQueries.getShoppingListById).toHaveBeenCalledWith(shoppingList.id);
		});
	});
});
