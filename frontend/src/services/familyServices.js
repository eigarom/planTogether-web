export async function createFamily(family) {
	const response = await fetch("/api/families/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	});
	const result = await response.json();

	if (response.ok) {
		return result.token;
	} else {
		throw new Error(result.message || "La connexion a échoué:");
	}
}