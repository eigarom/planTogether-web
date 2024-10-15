describe('tests authentification', function () {
	beforeEach(function (browser) {
		browser
			.navigateTo('http://localhost:5173')
			.waitForElementVisible('#loginForm', 5000);
	});

	afterEach(function (browser) {
		browser.end();
	});

	it('should login successfully with correct credentials and display the sidebar', function (browser) {
		browser
			.setValue('#loginForm input[name=email]', 'diddy_kong@banana.com')
			.setValue('#loginForm input[name=password]', 'Motdepasse12345*')
			.click('#loginForm button[type=submit]')
			.waitForElementVisible('#app', 5000)
			.getText('#app', function (result) {
				console.log(result.value);
			})
			.assert.visible('header')
			.assert.textContains('header h1', 'PlanTogether')
	});

	it('should fail to login with incorrect credentials', function (browser) {
		browser
			.setValue('#loginForm input[name=email]', 'wrong_email@banana.com')
			.setValue('#loginForm input[name=password]', 'WrongPassword123!')
			.click('#loginForm button[type=submit]')
			.waitForElementVisible('#loginForm .error-message', 5000)
			.assert.textContains('#loginForm .error-message', `Échec de l'authentification.`);
	});
});