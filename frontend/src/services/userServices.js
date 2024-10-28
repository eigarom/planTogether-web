export async function getUserFromToken(token) {
	const response = await fetch('/api/users/me', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	if (response.status === 404) {
		return undefined;
	}

	const result = await response.json();

	if (response.ok) {
		return {
			id: result.id,
			email: result.email,
			name: result.name,
			color: result.color,
			lang: result.lang,
			theme: result.theme
		};
	} else {
		throw new Error(result.message || `Erreur lors de l'obtention des informations de l'utilisateur`);
	}
}

export async function updateUser(token, userInformations) {
	const response = await fetch("/api/users/me", {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userInformations),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "L'utilisateur n'a pas pu être mis à jour:");
	}
}