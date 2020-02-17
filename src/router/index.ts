import Vue from 'vue';
import VueRouter from 'vue-router';
import RootView from '@/views/Root.vue';
import ViewerView from '@/views/Viewer.vue';

Vue.use(VueRouter);

const routes = [
	{
		name: 'Root',
		component: RootView,
		path: '/'
	},
	{
		name: 'Viewer',
		component: ViewerView,
		path: '/:slug'
	}
];

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes,
});

export default router;
