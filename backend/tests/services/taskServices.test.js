const TaskServices = require('../../src/services/TaskServices');

jest.mock('../../src/queries/TaskQueries');
const mockTaskQueries = require('../../src/queries/TaskQueries');

describe('TaskServices', () => {
	describe('deleteTask', () => {
		it('should call deleteTask query with the correct taskId', async () => {
			const taskId = 'task123';

			await TaskServices.deleteTask(taskId);

			expect(mockTaskQueries.deleteTask).toHaveBeenCalledWith(taskId);
		});
	});

	describe('deleteTasksList', () => {
		it('should call deleteTasksList query with the correct tasksListId', async () => {
			const tasksListId = 'tasksList123';

			await TaskServices.deleteTasksList(tasksListId);

			expect(mockTaskQueries.deleteTasksList).toHaveBeenCalledWith(tasksListId);
		});
	});

	describe('getTaskById', () => {
		it('should return the correct task if found', async () => {
			const taskId = 'task123';
			const mockResult = {
				name: 'Buy Groceries',
				description: 'Milk, Eggs, Bread',
				is_checked: false,
				id_tasks_list: 'list001',
			};
			mockTaskQueries.getTaskById.mockResolvedValue(mockResult);

			const task = await TaskServices.getTaskById(taskId);

			expect(task).toEqual({
				id: taskId,
				name: 'Buy Groceries',
				description: 'Milk, Eggs, Bread',
				isChecked: false,
				tasksListId: 'list001',
			});
			expect(mockTaskQueries.getTaskById).toHaveBeenCalledWith(taskId);
		});

		it('should return undefined if task does not exist', async () => {
			const taskId = 'taskXYZ';
			mockTaskQueries.getTaskById.mockResolvedValue(undefined);

			const task = await TaskServices.getTaskById(taskId);

			expect(task).toBeUndefined();
			expect(mockTaskQueries.getTaskById).toHaveBeenCalledWith(taskId);
		});
	});

	describe('getTasksByTasksListId', () => {
		it('should return an array of tasks if found', async () => {
			const tasksListId = 'list001';
			const mockResult = [
				{
					id_task: 'task1',
					name: 'Task 1',
					description: 'Do something',
					is_checked: false,
				},
				{
					id_task: 'task2',
					name: 'Task 2',
					description: 'Do something else',
					is_checked: true,
				},
			];
			mockTaskQueries.getTasksByTasksListId.mockResolvedValue(mockResult);

			const tasks = await TaskServices.getTasksByTasksListId(tasksListId);

			expect(tasks).toEqual([
				{
					id: 'task1',
					name: 'Task 1',
					description: 'Do something',
					isChecked: false,
				},
				{
					id: 'task2',
					name: 'Task 2',
					description: 'Do something else',
					isChecked: true,
				},
			]);
			expect(mockTaskQueries.getTasksByTasksListId).toHaveBeenCalledWith(tasksListId);
		});

		it('should return undefined if no tasks are found', async () => {
			const tasksListId = 'emptyList';
			mockTaskQueries.getTasksByTasksListId.mockResolvedValue(undefined);

			const tasks = await TaskServices.getTasksByTasksListId(tasksListId);

			expect(tasks).toBeUndefined();
			expect(mockTaskQueries.getTasksByTasksListId).toHaveBeenCalledWith(tasksListId);
		});
	});

	describe('getTasksListById', () => {
		it('should return the tasks list and its tasks if found', async () => {
			const tasksListId = 'list001';
			const mockTasksList = {name: 'House Chores'};
			const mockTasks = [
				{
					id_task: 'task1',
					name: 'Clean Kitchen',
					description: 'Wash dishes, wipe counters',
					is_checked: false,
				},
			];

			mockTaskQueries.getTasksListById.mockResolvedValue(mockTasksList);
			mockTaskQueries.getTasksByTasksListId.mockResolvedValue(mockTasks);

			const tasksList = await TaskServices.getTasksListById(tasksListId);

			expect(tasksList).toEqual({
				id: 'list001',
				name: 'House Chores',
				tasks: [
					{
						id: 'task1',
						name: 'Clean Kitchen',
						description: 'Wash dishes, wipe counters',
						isChecked: false,
					},
				],
			});
			expect(mockTaskQueries.getTasksListById).toHaveBeenCalledWith(tasksListId);
			expect(mockTaskQueries.getTasksByTasksListId).toHaveBeenCalledWith(tasksListId);
		});

		it('should return undefined if the tasks list does not exist', async () => {
			const tasksListId = 'listNoExist';
			mockTaskQueries.getTasksListById.mockResolvedValue(undefined);

			const tasksList = await TaskServices.getTasksListById(tasksListId);

			expect(tasksList).toBeUndefined();
			expect(mockTaskQueries.getTasksListById).toHaveBeenCalledWith(tasksListId);
		});
	});

	describe('getTasksLists', () => {
		it('should return an array of tasks lists with their tasks', async () => {
			const familyId = 'family001';
			const mockFamilyLists = [
				{id_tasks_list: 'list001'},
				{id_tasks_list: 'list002'},
			];
			const mockList001 = {name: 'List A'};
			const mockList002 = {name: 'List B'};
			const mockList001Tasks = [
				{
					id_task: 'taskA1',
					name: 'Task A1',
					description: 'Do something',
					is_checked: false,
				},
			];
			const mockList002Tasks = [
				{
					id_task: 'taskB1',
					name: 'Task B1',
					description: 'Do something else',
					is_checked: true,
				},
			];

			mockTaskQueries.getTasksLists.mockResolvedValue(mockFamilyLists);
			// For getTasksListById, we'll return the "parent" object { name: ... }
			mockTaskQueries.getTasksListById
				.mockResolvedValueOnce(mockList001)
				.mockResolvedValueOnce(mockList002);
			// For getTasksByTasksListId, we'll return the array of tasks for each list
			mockTaskQueries.getTasksByTasksListId
				.mockResolvedValueOnce(mockList001Tasks)
				.mockResolvedValueOnce(mockList002Tasks);

			const tasksLists = await TaskServices.getTasksLists(familyId);

			expect(tasksLists).toEqual([
				{
					id: 'list001',
					name: 'List A',
					tasks: [
						{
							id: 'taskA1',
							name: 'Task A1',
							description: 'Do something',
							isChecked: false,
						},
					],
				},
				{
					id: 'list002',
					name: 'List B',
					tasks: [
						{
							id: 'taskB1',
							name: 'Task B1',
							description: 'Do something else',
							isChecked: true,
						},
					],
				},
			]);
			expect(mockTaskQueries.getTasksLists).toHaveBeenCalledWith(familyId);
		});

		it('should return an empty array if no tasks lists are found for the family', async () => {
			const familyId = 'familyNoLists';
			mockTaskQueries.getTasksLists.mockResolvedValue([]);

			const tasksLists = await TaskServices.getTasksLists(familyId);

			expect(tasksLists).toEqual([]);
			expect(mockTaskQueries.getTasksLists).toHaveBeenCalledWith(familyId);
		});
	});

	describe('insertTask', () => {
		it('should insert a new task and return it', async () => {
			const taskData = {
				name: 'Buy Coffee',
				description: 'Ground coffee beans',
				isChecked: false,
				tasksListId: 'list001',
			};
			const newTaskId = 'newTask123';
			const mockNewTask = {
				name: 'Buy Coffee',
				description: 'Ground coffee beans',
				is_checked: false,
				id_tasks_list: 'list001',
			};

			mockTaskQueries.insertTask.mockResolvedValue(newTaskId);
			mockTaskQueries.getTaskById.mockResolvedValue(mockNewTask);

			const insertedTask = await TaskServices.insertTask(taskData);

			expect(insertedTask).toEqual({
				id: newTaskId,
				name: 'Buy Coffee',
				description: 'Ground coffee beans',
				isChecked: false,
				tasksListId: 'list001',
			});
			expect(mockTaskQueries.insertTask).toHaveBeenCalledWith(taskData);
			expect(mockTaskQueries.getTaskById).toHaveBeenCalledWith(newTaskId);
		});
	});

	describe('insertTasksList', () => {
		it('should insert a new tasks list and return it', async () => {
			const tasksListData = {name: 'New Tasks List', familyId: 'family123'};
			const newTasksListId = 'newList123';
			const mockListResult = {
				name: 'New Tasks List',
			};

			mockTaskQueries.insertTasksList.mockResolvedValue(newTasksListId);
			mockTaskQueries.getTasksListById.mockResolvedValue(mockListResult);
			// Because getTasksByTasksListId is also called inside getTasksListById:
			mockTaskQueries.getTasksByTasksListId.mockResolvedValue([]);

			const insertedList = await TaskServices.insertTasksList(tasksListData);

			expect(insertedList).toEqual({
				id: newTasksListId,
				name: 'New Tasks List',
				tasks: [],
			});
			expect(mockTaskQueries.insertTasksList).toHaveBeenCalledWith(tasksListData);
			expect(mockTaskQueries.getTasksListById).toHaveBeenCalledWith(newTasksListId);
		});
	});

	describe('isTaskListInFamily', () => {
		it('should return true if the tasks list belongs to the family', async () => {
			const tasksListId = 'list123';
			const familyId = 'familyABC';
			mockTaskQueries.isTasksListInFamily.mockResolvedValue(true);

			const result = await TaskServices.isTaskListInFamily(tasksListId, familyId);

			expect(result).toBe(true);
			expect(mockTaskQueries.isTasksListInFamily).toHaveBeenCalledWith(tasksListId, familyId);
		});

		it('should return false if the tasks list does not belong to the family', async () => {
			const tasksListId = 'listXYZ';
			const familyId = 'family000';
			mockTaskQueries.isTasksListInFamily.mockResolvedValue(false);

			const result = await TaskServices.isTaskListInFamily(tasksListId, familyId);

			expect(result).toBe(false);
			expect(mockTaskQueries.isTasksListInFamily).toHaveBeenCalledWith(tasksListId, familyId);
		});
	});

	describe('updateTask', () => {
		it('should update the task and return the updated task', async () => {
			const taskData = {
				id: 'task999',
				name: 'Clean bedroom',
				description: 'Organize clothes, vacuum floor',
				isChecked: true,
			};
			const mockUpdatedTask = {
				name: 'Clean bedroom',
				description: 'Organize clothes, vacuum floor',
				is_checked: true,
				id_tasks_list: 'list123',
			};

			mockTaskQueries.updateTask.mockResolvedValue(true);
			mockTaskQueries.getTaskById.mockResolvedValue(mockUpdatedTask);

			const updatedTask = await TaskServices.updateTask(taskData);

			expect(updatedTask).toEqual({
				id: taskData.id,
				name: 'Clean bedroom',
				description: 'Organize clothes, vacuum floor',
				isChecked: true,
				tasksListId: 'list123',
			});
			expect(mockTaskQueries.updateTask).toHaveBeenCalledWith(taskData);
			expect(mockTaskQueries.getTaskById).toHaveBeenCalledWith(taskData.id);
		});
	});

	describe('updateTasksList', () => {
		it('should update the tasks list and return it', async () => {
			const tasksListData = {id: 'list123', name: 'Updated List Name'};
			const mockUpdatedList = {
				name: 'Updated List Name',
			};

			mockTaskQueries.updateTasksList.mockResolvedValue(true);
			mockTaskQueries.getTasksListById.mockResolvedValue(mockUpdatedList);
			// Again, because getTasksListById will also call getTasksByTasksListId:
			mockTaskQueries.getTasksByTasksListId.mockResolvedValue([]);

			const updatedList = await TaskServices.updateTasksList(tasksListData);

			expect(updatedList).toEqual({
				id: 'list123',
				name: 'Updated List Name',
				tasks: [],
			});
			expect(mockTaskQueries.updateTasksList).toHaveBeenCalledWith(tasksListData);
			expect(mockTaskQueries.getTasksListById).toHaveBeenCalledWith('list123');
		});
	});
});
