export async function getAllMembersByFamilyId(token) { 
	const response = await fetch("/api/families/my-family/members", {
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	});
	const result = await response.json();

	if (response.ok) {
		const allFamilyMembers = {
			accountMembers: result.accountMembers,
			guestMembers: result.guestMembers
		}

		return allFamilyMembers;
	
	} else {
		throw new Error(result.message || `Erreur lors de l'obtention de la liste des membres`);
	}
}

export async function createMember(memberInformations, token) {
	const response = await fetch("/api/families/my-family/members", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(memberInformations),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "Le membre n'a pas pu être créé:");
	}
}

export async function getMemberById(token, memberId) {
	const response = await fetch(`/api/families/my-family/members/${memberId}`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	const result = await response.json();

	if (response.ok) {
		const member = {
			id: result.id,
			name: result.name,
			color: result.color
		};
		return member;
	} else {
		throw new Error(result.message || "Membre introuvable");
	}
}

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

export async function uploadMemberImage(token, memberId, formData) {
	try {
		const response = await fetch(`/api/families/my-family/members/${memberId}/image`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		});

		const blob = await response.blob();

		return URL.createObjectURL(blob);
	} catch (error) {
		throw new Error(error || `Erreur lors du chargement de l'image du membre`);
	}
}

export async function deleteMemberImage(token, memberId) {
	try {
		await fetch(`/api/families/my-family/members/${memberId}/image`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
	} catch (error) {
		throw new Error(error || `Erreur lors de la suppression de l'image du membre`);
	}
}

export async function updateMemberById(token, memberInformations, memberId) {
	const response = await fetch(`/api/families/my-family/members/${memberId}`, {
		method: "PUT",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(memberInformations),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "L'utilisateur n'a pas pu être mis à jour:");
	}
}

export async function deleteMember(token, memberId) {
	const response = await fetch(`/api/families/my-family/members/${memberId}`, {
		method: "DELETE",
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Le membre n'a pas pu être supprimé:");
	}
}