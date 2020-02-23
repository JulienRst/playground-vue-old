import Vue from 'vue';
import VueRouter from 'vue-router';
import RootView from '@/views/Root.vue';
import ViewerView from '@/views/Viewer.vue';
import AboutView from '@/views/About.vue';

Vue.use(VueRouter);

const routes = [
	{
		name: 'Root',
		component: RootView,
		path: '/'
	},
	{
		name: 'About',
		component: AboutView,
		path: '/about'
	},
	{
		name: 'Viewer',
		component: ViewerView,
		path: '/sandbox/:slug'
	}
];

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes,
});

export default router;
