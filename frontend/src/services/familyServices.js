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

export async function joinFamily(inviteCode, token) {
	const response = await fetch("/api/families/invite-code", {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			inviteCode: inviteCode
		}),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "La famille n'a pas pu être rejointe:");
	}
}

export async function createInvitationCode(token) {
	const response = await fetch("/api/families/my-family/invite", {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		}
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "Le code d'invitation n,a pas été créé:");
	}
}

export async function updateFamilyImage(familyId, formData, token) {
	const response = await fetch(`/api/families/my-family/image`, {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: formData
	});

	if (response.ok) {

	} else {
		throw new Error(`Impossible de modifier l'image du produit ${familyId}: ${response.status}`);
	}
}