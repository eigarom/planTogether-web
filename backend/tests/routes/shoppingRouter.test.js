const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/middlewares/auth/authMiddleware', () => jest.fn((req, res, next) => {
		req.user = {
			email: 'email',
			userId: 'userId',
			familyId: 'familyId',
		};
		next();
	})
);

jest.mock('../../src/services/ShoppingServices');
const mockShoppingServices = require('../../src/services/ShoppingServices');

describe('Shopping Router', () => {
	describe('GET /families/my-family/shoppinglists', () => {
		it('should return all shopping lists for the family', async () => {
			const mockShoppingLists = [
				{
					id: '1',
					name: 'Shopping List 1',
					items: [
						{id: '1', name: 'Item 1', isChecked: false},
						{id: '2', name: 'Item 2', isChecked: true},
					],
				},
				{
					id: '2',
					name: 'Shopping List 2',
					items: [
						{id: '3', name: 'Item 3', isChecked: false},
						{id: '4', name: 'Item 4', isChecked: true},
					],
				},
			];

			mockShoppingServices.getShoppingLists.mockResolvedValue(mockShoppingLists);

			const response = await request(app)
				.get('/families/my-family/shoppinglists')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(mockShoppingLists);
		});

		it('should return 404 if no shopping lists are found', async () => {
			mockShoppingServices.getShoppingLists.mockResolvedValue(null);

			const response = await request(app)
				.get('/families/my-family/shoppinglists')
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body.message).toEqual(
				'Liste de courses pour la famille familyId introuvables'
			);
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.getShoppingLists.mockRejectedValue(new Error());

			await request(app).get('/families/my-family/shoppinglists').expect(500);
		});
	});

	describe('POST /families/my-family/shoppinglists', () => {
		it('should create a new shopping list and return it', async () => {
			const mockShoppingList = {id: '1', name: 'New Shopping List'};

			mockShoppingServices.insertShoppingList.mockResolvedValue(mockShoppingList);

			const response = await request(app)
				.post('/families/my-family/shoppinglists')
				.send({name: 'New Shopping List'})
				.expect('Content-Type', /json/)
				.expect(201);

			expect(response.body).toEqual(mockShoppingList);
		});

		it('should return 400 if validation fails', async () => {
			const response = await request(app)
				.post('/families/my-family/shoppinglists')
				.send({name: ''}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.insertShoppingList.mockRejectedValue(new Error());

			await request(app)
				.post('/families/my-family/shoppinglists')
				.send({name: 'New Task List'})
				.expect(500);
		});
	});

	describe('PUT /families/my-family/shoppinglists/:id', () => {
		it('should update a shopping list and return it', async () => {
			const mockUpdatedShoppingList = {id: '1', name: 'Updated Shopping List'};

			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.updateShoppingList.mockResolvedValue(mockUpdatedShoppingList);

			const response = await request(app)
				.put('/families/my-family/shoppinglists/1')
				.send({name: 'Updated Shopping List'})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(mockUpdatedShoppingList);
		});

		it('should return 403 if the shopping list is not in the family', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.put('/families/my-family/shoppinglists/1')
				.send({name: 'Updated Shopping List'})
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de courses"
			);
		});

		it('should return 400 if validation fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);

			const response = await request(app)
				.put('/families/my-family/shoppinglists/1')
				.send({name: ''}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.updateShoppingList.mockRejectedValue(new Error());

			await request(app)
				.put('/families/my-family/shoppinglists/1')
				.send({name: 'Updated Shopping List'})
				.expect(500);
		});
	});

	describe('DELETE /families/my-family/shoppinglists/:id', () => {
		it('should delete a shopping list and return an empty object', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.deleteShoppingList.mockResolvedValue();

			const response = await request(app)
				.delete('/families/my-family/shoppinglists/1')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return 403 if the shopping list is not in the family', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.delete('/families/my-family/shoppinglists/1')
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de courses"
			);
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.deleteShoppingList.mockRejectedValue(new Error());

			await request(app).delete('/families/my-family/shoppinglists/1').expect(500);
		});
	});

	describe('POST /families/my-family/shoppinglists/:id/items', () => {
		it('should create a new item in a shopping list', async () => {
			const mockItem = {
				id: '1',
				name: 'New Item',
				isChecked: false
			};

			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.insertItem.mockResolvedValue(mockItem);

			const response = await request(app)
				.post('/families/my-family/shoppinglists/1/items')
				.send({
					name: 'New Task',
					isChecked: false,
				})
				.expect('Content-Type', /json/)
				.expect(201);

			expect(response.body).toEqual(mockItem);
		});

		it('should return 403 if the shopping list is not in the family', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.post('/families/my-family/shoppinglists/1/items')
				.send({
					name: 'New Item',
					isChecked: false,
				})
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de courses"
			);
		});

		it('should return 400 if validation fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);

			const response = await request(app)
				.post('/families/my-family/shoppinglists/1/items')
				.send({name: ''}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.insertItem.mockRejectedValue(new Error());

			await request(app)
				.post('/families/my-family/shoppinglists/1/items')
				.send({
					name: 'New Task',
					isChecked: false,
				})
				.expect(500);
		});
	});

	describe('DELETE /families/my-family/shoppinglists/:id/items/:itemId', () => {
		it('should delete an item and return an empty object', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.deleteItem.mockResolvedValue();

			const response = await request(app)
				.delete('/families/my-family/shoppinglists/1/items/1')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return 403 if the shopping list is not in the family', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.delete('/families/my-family/shoppinglists/1/items/1')
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de courses"
			);
		});

		it('should return 500 if the service fails', async () => {
			mockShoppingServices.isShoppingListInFamily.mockResolvedValue(true);
			mockShoppingServices.deleteItem.mockRejectedValue(new Error());

			await request(app)
				.delete('/families/my-family/shoppinglists/1/items/1')
				.expect(500);
		});
	});
});
