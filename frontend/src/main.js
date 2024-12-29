import {createApp} from 'vue';
import {createRouter, createWebHistory} from 'vue-router';
import VueCookies from 'vue-cookies';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import i18n from './locales/i18n.js';
import frLocale from './locales/fr/primevue.json';

import App from './App.vue';
import EventsList from './pages/events/calendar/EventsList.vue';
import EventDetails from './pages/events/EventDetails.vue';
import EventCreationForm from './pages/events/EventCreationForm.vue';
import TasksLists from './pages/taskslists/TasksLists.vue';
import LoginForm from "@/pages/auth/LoginForm.vue";
import FamilyOptions from "@/pages/families/FamilyOptions.vue";
import FamilyCreationForm from "@/pages/families/FamilyCreationForm.vue";
import FamilyJoinForm from "@/pages/families/FamilyJoinForm.vue";
import FamilyProfile from "@/pages/families/FamilyProfile.vue";
import RegisterForm from "@/pages/auth/RegisterForm.vue";
import UserProfile from "@/pages/users/UserProfile.vue";
import MemberProfile from './pages/members/MemberProfile.vue';
import LandingPage from "@/pages/landing/LandingPage.vue";

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
	},
	locale: frLocale
});
app.use(ConfirmationService);

app.config.globalProperties.$primevue = {config: app.config.globalProperties.$primevue.config};

// Cookies
app.use(VueCookies, {expires: '100d'});

// Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{path: '/', component: LandingPage},
		{path: '/login', component: LoginForm},
		{path: '/register', component: RegisterForm},
		{path: '/events', component: EventsList},
		{path: '/events/:id/periods/:periodId', component: EventDetails, props: true},
		{path: '/events/add', component: EventCreationForm},
		{path: '/tasks-lists', component: TasksLists},
		{path: '/families/add-or-join', component: FamilyOptions},
		{path: '/families/add', component: FamilyCreationForm},
		{path: '/families/join', component: FamilyJoinForm},
		{path: '/my-family', component: FamilyProfile},
		{path: '/members/:id', component: MemberProfile, props: true},
		{path: '/profile', component: UserProfile},
		{path: '/:pathMatch(.*)*', redirect: '/events'} // Route catch-all
	]
});
router.beforeEach((to, from, next) => {
		const token = app.config.globalProperties.$cookies.get('jwtToken');
		if (to.path === '/register' && !token) {
			next();
		} else if (to.path === '/login' && !token) {
			next();
		} else if (to.path !== '/' && !token) {
			next('/');
		} else if (to.path === '/' && token) {
			next('/events');
		} else {
			next();
		}
	}
)
app.use(router);

// Multi-lingue
app.use(i18n)

app.mount("#app");