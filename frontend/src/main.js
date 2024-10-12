import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import Home from './pages/Calendar.vue';

const app = createApp(App);

// Requis pour l'injection réactive
app.config.unwrapInjectedRef = true;

app.use(VueCookies, {expires: '100d'});

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{path: '/calendar', component: Home},
	]
});

app.use(router);

app.mount("#app");