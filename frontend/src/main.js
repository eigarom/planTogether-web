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
import FamilyMemberCreationForm from "@/pages/families/FamilyMemberCreationForm.vue";

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
		{path: '/login', component: LoginForm},
		{path: '/register', component: RegisterForm},
		{path: '/events', component: EventsList},
		{path: '/families/add', component: FamilyCreationForm},
		{path: '/families/my-family/members', component: FamilyMemberCreationForm},
		{path: '/', redirect: '/events'}
	]
});
router.beforeEach((to, from, next) => {
		const token = app.config.globalProperties.$cookies.get('jwtToken');
		if (to.path === '/register' && !token) {
			next();
		} else if (to.path !== '/login' && !token) {
			next('/login');
		} else if (to.path === '/login' && token) {
			next('/');
		} else if (to.path === '/families/my-family/members' && token) {
			next();
		} else {
			next();
		}
	}
)
app.use(router);

app.mount("#app");