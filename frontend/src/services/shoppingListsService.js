export async function getShoppingLists(token) {
	const response = await fetch("/api/families/my-family/shoppinglists", {
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

export async function createShoppingList(token, shoppingList) {
	const response = await fetch("/api/families/my-family/shoppinglists", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(shoppingList),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La liste de courses n'a pas pu être créé:");
	}
}

export async function createItem(token, shoppingListId, item) {
	const response = await fetch(`/api/families/my-family/shoppinglists/${shoppingListId}/items`, {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(item),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "Le produit n'a pas pu être créé:");
	}
}

export async function updateItem(token, shoppingListId, item, itemId) {
	const response = await fetch(`/api/families/my-family/shoppinglists/${shoppingListId}/items/${itemId}`, {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(item),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "Le produit n'a pas pu être modifié:");
	}
}

export async function deleteItem(token, shoppingListId, itemId) {
	const response = await fetch(`/api/families/my-family/shoppinglists/${shoppingListId}/items/${itemId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Le produit n'a pas pu être supprimé:");
	}
}

export async function updateShoppingList(token, shoppingList, shoppingListId) {
	const response = await fetch(`/api/families/my-family/shoppinglists/${shoppingListId}`, {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(shoppingList),
	});

	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La liste de courses n'a pas pu être modifiée:");
	}
}

export async function deleteShoppingList(token, shoppingListId) {
	const response = await fetch(`/api/families/my-family/shoppinglists/${shoppingListId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "La liste de courses n'a pas pu être supprimée:");
	}
}