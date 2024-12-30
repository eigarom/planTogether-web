export async function getTasksLists(token) {
	const response = await fetch("/api/families/my-family/taskslists", {
		method: "GET",
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	});

	if (response.status === 404) {
		return undefined;
	}

	return await response.json();
}

export async function createTasksList(token, tasksList) {
	const response = await fetch("/api/families/my-family/taskslists", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tasksList),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La liste de tâches n'a pas pu être créé:");
	}
}

export async function createTask(token, tasksListId, task) {
	const response = await fetch(`/api/families/my-family/taskslists/${tasksListId}/tasks`, {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(task),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La tâche n'a pas pu être créée:");
	}
}

export async function updateTask(token, tasksListId, task, taskId) {
	const response = await fetch(`/api/families/my-family/taskslists/${tasksListId}/tasks/${taskId}`, {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(task),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La tâche n'a pas pu être modifiée:");
	}
}

export async function deleteTask(token, tasksListId, taskId) {
	const response = await fetch(`/api/families/my-family/taskslists/${tasksListId}/tasks/${taskId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "La tâche n'a pas pu être supprimée:");
	}
}

export async function updateTasksList(token, tasksList, tasksListId) {
	const response = await fetch(`/api/families/my-family/taskslists/${tasksListId}`, {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(tasksList),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La liste de tâches n'a pas pu être modifiée:");
	}
}

export async function deleteTasksList(token, tasksListId) {
	const response = await fetch(`/api/families/my-family/taskslists/${tasksListId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "La liste de tâches n'a pas pu être supprimée:");
	}
}