import Vue from 'vue';
import VueRouter from 'vue-router';
import RootView from '@/views/Root.vue';

Vue.use(VueRouter);

const routes = [
	{
		name: 'root',
		component: RootView,
		path: '/'
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
