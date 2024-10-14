import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import EventsList from './pages/events/EventsList.vue';
import LoginForm from "@/pages/auth/LoginForm.vue";


const app = createApp(App);

// Requis pour l'injection réactive
app.config.unwrapInjectedRef = true;

app.use(VueCookies, {expires: '100d'});

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{path: '/events', component: EventsList},
		{path: '/login', component: LoginForm},
		{path: '/', redirect: '/events'}
	]
});

router.beforeEach((to, from, next) => {
	const token = app.config.globalProperties.$cookies.get('jwtToken');
	if (to.path !== '/login' && !token) {
		next('/login');
	} else {
		next();
	}
});

app.use(router);

app.mount("#app");