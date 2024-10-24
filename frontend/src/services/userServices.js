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

export async function getUserImage(token) {
	try {
		const response = await fetch('/api/users/me/image', {
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		if (response.status === 404) {
			return undefined;
		}

		const blob = await response.blob();

		return URL.createObjectURL(blob);
	} catch (error) {
		throw new Error(error || `Erreur lors du chargement de l'image de l,utilisateur`);
	}
}