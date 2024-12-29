const pool = require("./dbPool");

class TaskQueries {
	static async deleteTask(taskId) {
		await pool.query(
			`DELETE
             FROM task
             WHERE id_task = $1`,
			[taskId]
		);
	}

	static async deleteTasksList(tasksListId) {
		await pool.query(
			`DELETE
             FROM tasks_list
             WHERE id_tasks_list = $1`,
			[tasksListId]
		);
	}

	static async getTaskById(taskId) {
		const result = await pool.query(
			`SELECT name, description, is_checked, id_tasks_list
             FROM task
             WHERE id_task = $1`,
			[taskId]
		);
		return result.rows[0];
	}

	static async getTasksByTasksListId(tasksListId) {
		const result = await pool.query(
			`SELECT id_task, name, description, is_checked
             FROM task
             WHERE id_tasks_list = $1
             ORDER BY name`,
			[tasksListId]
		);
		return result.rows;
	}

	static async getTasksListById(tasksListId) {
		const result = await pool.query(
			`SELECT name
             FROM tasks_list
             WHERE id_tasks_list = $1`,
			[tasksListId]
		);
		return result.rows[0];
	}

	static async getTasksLists(familyId) {
		const result = await pool.query(
			`SELECT id_tasks_list
             FROM tasks_list
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows;
	}

	static async insertTask(task) {
		const result = await pool.query(
			`INSERT INTO task(name, description, is_checked, id_tasks_list)
             VALUES ($1, $2, $3, $4)
             RETURNING id_task`,
			[task.name, task.description, task.isChecked, task.tasksListId]
		);
		return result.rows[0].id_task;
	}

	static async insertTasksList(tasksList) {
		const result = await pool.query(
			`INSERT INTO tasks_list(name, id_family)
             VALUES ($1, $2)
             RETURNING id_tasks_list`,
			[tasksList.name, tasksList.familyId]
		);
		return result.rows[0].id_tasks_list;
	}

	static async isTasksListInFamily(tasksListId, familyId) {
		const result = await pool.query(
			`SELECT id_tasks_list
             FROM tasks_list
             WHERE id_tasks_list = $1
               AND id_family = $2`,
			[tasksListId, familyId]
		);
		return result.rows.length > 0;
	}

	static async updateTask(task) {
		const result = await pool.query(
			`UPDATE task
             SET name       = $1,
                 description=$2,
                 is_checked = $3
             WHERE id_task = $4
             RETURNING id_task`,
			[task.name, task.description, task.isChecked, task.id]
		);
		return result.rows[0].id_task;
	}

	static async updateTasksList(tasksList) {
		const result = await pool.query(
			`UPDATE tasks_list
             SET name = $1
             WHERE id_tasks_list = $2
             RETURNING id_tasks_list`,
			[tasksList.name, tasksList.id]
		);
		return result.rows[0].id_tasks_list;
	}
}

module.exports = TaskQueries;
