import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './pages/auth/Login.vue';
import Home from './pages/Home.vue';

const app = createApp(App);

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '', component: Home },
		{ path: '/login', component: Login }
	]
});

// Ajout de Vue Router à l'application
app.use(router);

app.mount("#app");