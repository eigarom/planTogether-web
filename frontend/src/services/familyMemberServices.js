export async function createFamilyMember(familyMember, token) {
	const response = await fetch("/api/families/my-family/members", {
		method: "POST",
		headers: {
			'Authorization': `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: familyMember.name,
			color: familyMember.color
		}),
	});
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message || "Le membre n'a pas pu être créé:");
	}
}