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