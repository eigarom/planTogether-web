describe('tests registration', function () {
	beforeEach(function (browser) {
		browser
			.navigateTo('http://localhost:5173/register')
			.waitForElementVisible('#registerForm', 5000);
	});

	afterEach(function (browser) {
		browser.end();
	});

	it('should register successfully with correct details and redirect to homepage', function (browser) {
		browser
			.setValue('#registerForm #email', 'test@example.com')
			.setValue('#registerForm #password', 'StrongPassword1*')
			.setValue('#registerForm #repeat_password', 'StrongPassword1*')
			.setValue('#registerForm #name', 'Test User')
			.click('#registerForm button[type=submit]')
			.waitForElementNotPresent('#registerForm', 5000)
			.assert.urlEquals('http://localhost:5173/events');
	});

	it('should fail to register with invalid email', function (browser) {
		browser
			.setValue('#registerForm #email', 'invalid_email')
			.setValue('#registerForm #password', 'StrongPassword1*')
			.setValue('#registerForm #repeat_password', 'StrongPassword1*')
			.setValue('#registerForm #name', 'Test User')
			.click('#registerForm button[type=submit]')
			.waitForElementVisible('#registerForm .error-message', 5000)
			.assert.textContains('#registerForm .error-message', `Le courriel n'est pas valide`);
	});

	it('should fail to register with non-matching passwords', function (browser) {
		browser
			.setValue('#registerForm #email', 'test@example.com')
			.setValue('#registerForm #password', 'StrongPassword1*')
			.setValue('#registerForm #repeat_password', 'DifferentPassword123!')
			.setValue('#registerForm #name', 'Test User')
			.click('#registerForm button[type=submit]')
			.waitForElementVisible('#registerForm .error-message', 5000)
			.assert.textContains('#registerForm .error-message', 'Les mots de passe doivent être identiques');
	});

	it('should fail to register with invalid name', function (browser) {
		browser
			.setValue('#registerForm #email', 'test@example.com')
			.setValue('#registerForm #password', 'StrongPassword1*')
			.setValue('#registerForm #repeat_password', 'StrongPassword1*')
			.setValue('#registerForm #name', 'Invalid@Name')
			.click('#registerForm button[type=submit]')
			.waitForElementVisible('#registerForm .error-message', 5000)
			.assert.textContains('#registerForm .error-message', `Le nom n'est pas valide`);
	});

	it('should fail to register with an email that is already in use', function (browser) {
		browser
			.setValue('#registerForm #email', 'diddy_kong@banana.com')
			.setValue('#registerForm #password', 'StrongPassword1*')
			.setValue('#registerForm #repeat_password', 'StrongPassword1*')
			.setValue('#registerForm #name', 'Test User')
			.click('#registerForm button[type=submit]')
			.waitForElementVisible('#registerForm .error-message', 5000)
			.assert.textContains('#registerForm .error-message', `Le courriel n'est pas disponible`);
	});
});