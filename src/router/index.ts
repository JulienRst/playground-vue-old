import Vue from 'vue';
import VueRouter from 'vue-router';
import RootView from '@/views/Root.vue';

Vue.use(VueRouter);

const routes = [
	{
		name: 'Root',
		// component: () => import(/* webpackChunkName: "root" */ '@/views/Root.vue'),
		component: RootView,
		path: '/'
	},
	{
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
		path: '/about'
	},
	{
		name: 'Viewer',
		component: () => import(/* webpackChunkName: "viewer" */ '@/views/Viewer.vue'),
		path: '/sandbox/:slug'
	}
];

const router = new VueRouter({
	mode: 'history',
	routes
});

export default router;
