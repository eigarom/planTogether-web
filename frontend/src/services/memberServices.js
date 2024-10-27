export async function getMemberImage(token, memberId) {
	try {
		const response = await fetch(`/api/families/my-family/members/${memberId}/image`, {
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
		throw new Error(error || `Erreur lors du chargement de l'image du membre`);
	}
}