export async function getFamilyFromToken(token) {
	const response = await fetch('/api/families/my-family', {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	const result = await response.json();

	if (response.ok) {
		if (!result.family) {
			return undefined;
		}
		return {
			name: result.family.name,
			color: result.family.color
		};
	} else {
		throw new Error(result.message || `Erreur lors de l'obtention des informations de la famille`);
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

export async function updateFamilyImage(familytId, formData, token) {
    const response = await fetch(`/api/families/my-family/image`, {
        method: "POST",
        headers: {
           'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (response.ok) {
        return;
    } else {
        throw new Error(`Impossible de modifier l'image du produit ${familytId}: ${response.status}`);
    }
}