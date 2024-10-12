export async function getUserInfo(token) {
	const response = await fetch('/api/users/me', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	if (response.ok) {
		const respUser = await response.json();

		return {
			email: respUser.email,
			name: respUser.name,
			color: respUser.color,
			imageContent: respUser.imageContent,
			imageContentType: respUser.imageContentType,
			lang: respUser.lang,
			theme: respUser.theme
		};
	} else {
		throw new Error(`Erreur lors de l'obtention des informations de l'utilisateur`);
	}
}