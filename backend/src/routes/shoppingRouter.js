const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const ShoppingServices = require("../services/ShoppingServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");
const {shoppingListSchema, shoppingItemSchema} = require("../schemas/shoppingSchemas");

const verifyShoppingListId = async (req, res, next) => {
	const shoppingListId = req.params.id;

	if (!await ShoppingServices.isShoppingListInFamily(shoppingListId, req.user.familyId)) {
		return next(new HttpError(403, "Accès non autorisé aux données de cette liste de courses"));
	}
	next();
};

router.get('/', verifyJWT, async (req, res, next) => {
	const familyId = req.user.familyId;

	try {
		const shoppingLists = await ShoppingServices.getShoppingLists(familyId);

		if (shoppingLists) {
			res.json(shoppingLists);
		} else {
			return next(new HttpError(404, `Liste de courses pour la famille ${familyId} introuvables`));
		}
	} catch (error) {
		return next(error);
	}
});

router.post('/', verifyJWT, async (req, res, next) => {
	const {error} = shoppingListSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	try {
		const shoppingListDetails = {
			familyId: "" + req.user.familyId,
			name: "" + req.body.name,
		};

		const newShoppingList = await ShoppingServices.insertShoppingList(shoppingListDetails);

		res.status(201).json(newShoppingList);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id', verifyJWT, verifyShoppingListId, async (req, res, next) => {
	const {error} = shoppingListSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const shoppingListId = req.params.id;

	try {
		const shoppingListDetails = {
			id: "" + shoppingListId,
			name: "" + req.body.name,
		};

		const updatedShoppingList = await ShoppingServices.updateShoppingList(shoppingListDetails);

		res.status(200).json(updatedShoppingList);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id', verifyJWT, verifyShoppingListId, async (req, res, next) => {
	const shoppingListId = req.params.id;

	try {
		await ShoppingServices.deleteShoppingList(shoppingListId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

router.post('/:id/items', verifyJWT, verifyShoppingListId, async (req, res, next) => {
	const {error} = shoppingItemSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const shoppingListId = req.params.id;

	try {
		const itemDetails = {
			name: "" + req.body.name,
			isChecked: "" + req.body.isChecked,
			shoppingListId: "" + shoppingListId
		};

		const newItem = await ShoppingServices.insertItem(itemDetails);

		res.status(201).json(newItem);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id/items/:itemId', verifyJWT, verifyShoppingListId, async (req, res, next) => {
	const {error} = shoppingItemSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const shoppingListId = req.params.id;
	const itemId = req.params.itemId;

	try {
		const itemDetails = {
			id: "" + itemId,
			name: "" + req.body.name,
			isChecked: "" + req.body.isChecked,
			shoppingListId: "" + shoppingListId
		};

		const updatedItem = await ShoppingServices.updateItem(itemDetails);

		res.status(200).json(updatedItem);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id/items/:itemId', verifyJWT, verifyShoppingListId, async (req, res, next) => {
	const itemId = req.params.itemId;

	try {
		await ShoppingServices.deleteItem(itemId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

module.exports = router;