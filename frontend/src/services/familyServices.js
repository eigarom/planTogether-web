export async function getFamilyFromToken(token) {
	const response = await fetch('/api/families/my-family', {
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
			name: result.name,
			color: result.color
		};
	} else {
		throw new Error(result.message || `Erreur lors de l'obtention des informations de la famille`);
	}
}

export async function getFamilyImage(token) {
	try {
		const response = await fetch('/api/families/my-family/image', {
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
		throw new Error(error || `Erreur lors du chargement de l'image de la famille`);
	}
}

export async function createFamily(family, token) {
	const response = await fetch("/api/families", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: family.name,
			color: family.color
		}),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La famille n'a pas pu être créée:");
	}
}