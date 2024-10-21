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
		throw new Error(result.message || "La connexion a échoué");
	}
}

export async function register(email, password, name) {
	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			password: password,
			name: name
		}),
	});
	const result = await response.json();

	if (response.ok) {
		return result.token;
	} else {
		throw new Error(result.message || `L'inscription a échoué`);
	}
}