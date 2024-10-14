export async function getUserInfo(token) {
	const response = await fetch('/api/users/me', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	const result = await response.json();

	if (response.ok) {
		return {
			email: result.email,
			name: result.name,
			color: result.color,
			imageContent: result.imageContent,
			imageContentType: result.imageContentType,
			lang: result.lang,
			theme: result.theme
		};
	} else {
		throw new Error(result.message || 'Erreur lors de l\'obtention des informations de l\'utilisateur');
	}
}