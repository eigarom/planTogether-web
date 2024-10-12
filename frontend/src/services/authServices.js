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
	console.log(result.token);
	if (response.ok) {
		return result.token;
	} else {
		console.error("La connexion a échoué:", result.message);
	}
}