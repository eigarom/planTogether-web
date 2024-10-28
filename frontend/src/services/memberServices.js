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

export async function deleteUserImage(token, memberId) {
	try {
		const response = await fetch(`/api/families/my-family/members/${memberId}/image`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
	} catch (error) {
		throw new Error(error || `Erreur lors du chargement de l'image du membre`);
	}
}