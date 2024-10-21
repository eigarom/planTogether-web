import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import VueCookies from 'vue-cookies';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue';
import EventsList from './pages/events/EventsList.vue';
import LoginForm from "@/pages/auth/LoginForm.vue";
import FamilyCreationForm from "@/pages/families/FamilyCreationForm.vue";
import RegisterForm from "@/pages/auth/RegisterForm.vue";

const app = createApp(App);

// Requis pour l'injection réactive
app.config.unwrapInjectedRef = true;

// PrimeVue pour css
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.my-app-dark',
		}
	}
});

// Cookies
app.use(VueCookies, {expires: '100d'});

// Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{path: '/events', component: EventsList},
		{path: '/login', component: LoginForm},
		{path: '/register', component: RegisterForm},
		{path: '/families/add', component: FamilyCreationForm},
		{path: '/', redirect: '/events'}
	]
});
router.beforeEach((to, from, next) => {
		const token = app.config.globalProperties.$cookies.get('jwtToken');
		if (to.path === '/register') {
			next();
		} else if (to.path === '/login' && token) {
			next('/');
		} else if (to.path !== '/login' && !token) {
			next('/login');
		} else {
			next();
		}
	}
)
app.use(router);

app.mount("#app");