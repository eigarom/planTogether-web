export async function login(email, password) {
	const response = await fetch("/api/auth/login", {
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
		throw new Error("La connexion a échoué:", result.message);
	}
}