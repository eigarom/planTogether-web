const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const TaskServices = require("../services/TaskServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");
const {taskSListSchema, taskSchema} = require("../schemas/taskSchemas");

const verifyTaskListId = async (req, res, next) => {
	const taskListId = req.params.id;

	if (!await TaskServices.isTaskListInFamily(taskListId, req.user.familyId)) {
		return next(new HttpError(403, "Accès non autorisé aux données de cet liste de tâches"));
	}
	next();
};

router.get('/', verifyJWT, async (req, res, next) => {
	const familyId = req.user.familyId;

	try {
		const tasksLists = await TaskServices.getTasksLists(familyId);

		if (tasksLists) {
			res.json(tasksLists);
		} else {
			return next(new HttpError(404, `Liste de tâches pour la famille ${familyId} introuvables`));
		}
	} catch (error) {
		return next(error);
	}
});

router.post('/', verifyJWT, async (req, res, next) => {
	const {error} = taskSListSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	try {
		const tasksListDetails = {
			familyId: "" + req.user.familyId,
			name: "" + req.body.name,
		};

		const newTasksList = await TaskServices.insertTasksList(tasksListDetails);

		res.status(201).json(newTasksList);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id', verifyJWT, verifyTaskListId, async (req, res, next) => {
	const {error} = taskSListSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const tasksListId = req.params.id;

	try {
		const tasksListDetails = {
			id: "" + tasksListId,
			name: "" + req.body.name,
		};

		const updatedTasksList = await TaskServices.updateTasksList(tasksListDetails);

		res.status(200).json(updatedTasksList);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id', verifyJWT, verifyTaskListId, async (req, res, next) => {
	const tasksListId = req.params.id;

	try {
		await TaskServices.deleteTasksList(tasksListId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

router.post('/:id/tasks', verifyJWT, verifyTaskListId, async (req, res, next) => {
	const {error} = taskSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const tasksListId = req.params.id;

	try {
		const taskDetails = {
			name: "" + req.body.name,
			description: "" + req.body.description,
			isChecked: "" + req.body.isChecked,
			tasksListId: "" + tasksListId
		};

		const newTask = await TaskServices.insertTask(taskDetails);

		res.status(201).json(newTask);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id/tasks/:taskId', verifyJWT, verifyTaskListId, async (req, res, next) => {
	const {error} = taskSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const tasksListId = req.params.id;
	const taskId = req.params.taskId;

	try {
		const taskDetails = {
			id: "" + taskId,
			name: "" + req.body.name,
			description: "" + req.body.description,
			isChecked: "" + req.body.isChecked,
			tasksListId: "" + tasksListId
		};

		const updatedTask = await TaskServices.updateTask(taskDetails);

		res.status(200).json(updatedTask);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id/tasks/:taskId', verifyJWT, verifyTaskListId, async (req, res, next) => {
	const taskId = req.params.taskId;

	try {
		await TaskServices.deleteTask(taskId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

module.exports = router;