const TaskQueries = require("../queries/TaskQueries");

class TaskServices {
	static async deleteTask(taskId) {
		await TaskQueries.deleteTask(taskId);
	}

	static async deleteTasksList(tasksListId) {
		await TaskQueries.deleteTasksList(tasksListId);
	}

	static async getTaskById(taskId) {
		const result = await TaskQueries.getTaskById(taskId);
		if (result) {
			return {
				id: taskId,
				name: result.name,
				description: result.description,
				isChecked: result.is_checked,
				tasksListId: result.id_tasks_list
			};
		}

		return undefined;
	}

	static async getTasksByTasksListId(tasksListId) {
		const result = await TaskQueries.getTasksByTasksListId(tasksListId);

		if (result) {
			const tasks = [];
			for (let task of result) {
				tasks.push({
					id: task.id_task,
					name: task.name,
					description: task.description,
					isChecked: task.is_checked
				});
			}
			return tasks
		}

		return undefined;
	}

	static async getTasksListById(tasksListId) {
		const result = await TaskQueries.getTasksListById(tasksListId);
		if (result) {
			const tasks = await this.getTasksByTasksListId(tasksListId);
			return {
				id: tasksListId,
				name: result.name,
				tasks: tasks
			};
		}

		return undefined;
	}

	static async getTasksLists(familyId) {
		const familyTasksLists = await TaskQueries.getTasksLists(familyId);
		const tasksLists = [];

		for (let tasksList of familyTasksLists) {
			tasksLists.push(await this.getTasksListById(tasksList.id_tasks_list));
		}

		return tasksLists;
	}

	static async insertTask(task) {
		const newTaskId = await TaskQueries.insertTask(task);
		return this.getTaskById(newTaskId);
	}

	static async insertTasksList(tasksList) {
		const newTasksListId = await TaskQueries.insertTasksList(tasksList);
		return this.getTasksListById(newTasksListId);
	}

	static async isTaskListInFamily(tasksListId, familyId) {
		return await TaskQueries.isTasksListInFamily(tasksListId, familyId);
	}

	static async updateTask(task) {
		await TaskQueries.updateTask(task);
		return this.getTaskById(task.id);
	}

	static async updateTasksList(tasksList) {
		await TaskQueries.updateTasksList(tasksList);
		return this.getTasksListById(tasksList.id);
	}
}

module.exports = TaskServices;