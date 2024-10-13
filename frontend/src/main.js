import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import Calendar from './pages/Calendar.vue';
import Login from "@/pages/auth/Login.vue";


const app = createApp(App);

// Requis pour l'injection réactive
app.config.unwrapInjectedRef = true;

app.use(VueCookies, {expires: '100d'});

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{path: '/calendar', component: Calendar},
		{path: '/login', component: Login},
		{path: '/', redirect: '/calendar'}
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