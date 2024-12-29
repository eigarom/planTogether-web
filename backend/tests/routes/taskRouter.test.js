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

jest.mock('../../src/services/TaskServices');
const mockTaskServices = require('../../src/services/TaskServices');

describe('Task Router', () => {
	describe('GET /families/my-family/taskslists', () => {
		it('should return all task lists for the family', async () => {
			const mockTaskLists = [
				{
					id: '1',
					name: 'Task List 1',
					tasks: [
						{id: '1', name: 'Task 1', description: 'Do this', isChecked: false},
						{id: '2', name: 'Task 2', description: '', isChecked: true},
					],
				},
				{
					id: '2',
					name: 'Task List 2',
					tasks: [
						{id: '3', name: 'Task 3', description: 'Do that', isChecked: false},
						{id: '4', name: 'Task 4', description: '', isChecked: true},
					],
				},
			];

			mockTaskServices.getTasksLists.mockResolvedValue(mockTaskLists);

			const response = await request(app)
				.get('/families/my-family/taskslists')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(mockTaskLists);
		});

		it('should return 404 if no task lists are found', async () => {
			mockTaskServices.getTasksLists.mockResolvedValue(null);

			const response = await request(app)
				.get('/families/my-family/taskslists')
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body.message).toEqual(
				'Liste de tâches pour la famille familyId introuvables'
			);
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.getTasksLists.mockRejectedValue(new Error());

			await request(app).get('/families/my-family/taskslists').expect(500);
		});
	});

	describe('POST /families/my-family/taskslists', () => {
		it('should create a new task list and return it', async () => {
			const mockTaskList = {id: '1', name: 'New Task List'};

			mockTaskServices.insertTasksList.mockResolvedValue(mockTaskList);

			const response = await request(app)
				.post('/families/my-family/taskslists')
				.send({name: 'New Task List'})
				.expect('Content-Type', /json/)
				.expect(201);

			expect(response.body).toEqual(mockTaskList);
		});

		it('should return 400 if validation fails', async () => {
			const response = await request(app)
				.post('/families/my-family/taskslists')
				.send({name: ''}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.insertTasksList.mockRejectedValue(new Error());

			await request(app)
				.post('/families/my-family/taskslists')
				.send({name: 'New Task List'})
				.expect(500);
		});
	});

	describe('PUT /families/my-family/taskslists/:id', () => {
		it('should update a task list and return it', async () => {
			const mockUpdatedTaskList = {id: '1', name: 'Updated Task List'};

			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.updateTasksList.mockResolvedValue(mockUpdatedTaskList);

			const response = await request(app)
				.put('/families/my-family/taskslists/1')
				.send({name: 'Updated Task List'})
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(mockUpdatedTaskList);
		});

		it('should return 403 if the task list is not in the family', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.put('/families/my-family/taskslists/1')
				.send({name: 'Updated Task List'})
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de tâches"
			);
		});

		it('should return 400 if validation fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);

			const response = await request(app)
				.put('/families/my-family/taskslists/1')
				.send({name: ''}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.updateTasksList.mockRejectedValue(new Error());

			await request(app)
				.put('/families/my-family/taskslists/1')
				.send({name: 'Updated Task List'})
				.expect(500);
		});
	});

	describe('DELETE /families/my-family/taskslists/:id', () => {
		it('should delete a task list and return an empty object', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.deleteTasksList.mockResolvedValue();

			const response = await request(app)
				.delete('/families/my-family/taskslists/1')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return 403 if the task list is not in the family', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.delete('/families/my-family/taskslists/1')
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de tâches"
			);
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.deleteTasksList.mockRejectedValue(new Error());

			await request(app).delete('/families/my-family/taskslists/1').expect(500);
		});
	});

	describe('POST /families/my-family/taskslists/:id/tasks', () => {
		it('should create a new task in a task list', async () => {
			const mockTask = {
				id: '1',
				name: 'New Task',
				description: 'Do this',
				isChecked: false
			};

			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.insertTask.mockResolvedValue(mockTask);

			const response = await request(app)
				.post('/families/my-family/taskslists/1/tasks')
				.send({
					name: 'New Task',
					description: 'Do this',
					isChecked: false,
				})
				.expect('Content-Type', /json/)
				.expect(201);

			expect(response.body).toEqual(mockTask);
		});

		it('should return 403 if the task list is not in the family', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.post('/families/my-family/taskslists/1/tasks')
				.send({
					name: 'New Task',
					description: 'Do this',
					isChecked: false,
				})
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de tâches"
			);
		});

		it('should return 400 if validation fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);

			const response = await request(app)
				.post('/families/my-family/taskslists/1/tasks')
				.send({name: '', description: 'Do this'}) // Invalid name
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.insertTask.mockRejectedValue(new Error());

			await request(app)
				.post('/families/my-family/taskslists/1/tasks')
				.send({
					name: 'New Task',
					description: 'Do this',
					isChecked: false,
				})
				.expect(500);
		});
	});

	describe('DELETE /families/my-family/taskslists/:id/tasks/:taskId', () => {
		it('should delete a task and return an empty object', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.deleteTask.mockResolvedValue();

			const response = await request(app)
				.delete('/families/my-family/taskslists/1/tasks/1')
				.expect(200);

			expect(response.body).toEqual({});
		});

		it('should return 403 if the task list is not in the family', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(false);

			const response = await request(app)
				.delete('/families/my-family/taskslists/1/tasks/1')
				.expect(403);

			expect(response.body.message).toEqual(
				"Accès non autorisé aux données de cette liste de tâches"
			);
		});

		it('should return 500 if the service fails', async () => {
			mockTaskServices.isTaskListInFamily.mockResolvedValue(true);
			mockTaskServices.deleteTask.mockRejectedValue(new Error());

			await request(app)
				.delete('/families/my-family/taskslists/1/tasks/1')
				.expect(500);
		});
	});
});
