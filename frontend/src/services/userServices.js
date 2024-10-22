export async function getUserFromToken(token) {
	const response = await fetch('/api/users/me', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});

	const result = await response.json();

	if (response.ok) {
		if (!result.user) {
			return undefined;
		}
		return {
			email: result.user.email,
			name: result.user.name,
			color: result.user.color,
			lang: result.user.lang,
			theme: result.user.theme
		};
	} else {
		throw new Error(result.message || `Erreur lors de l'obtention des informations de l'utilisateur`);
	}
}