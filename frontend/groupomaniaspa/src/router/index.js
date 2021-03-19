import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import OneGag from "../views/OneGag.vue";
import PostGag from "../views/PostGag.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/:gagId",
		name: "OneGag",
		component: OneGag,
	},
	{
		path: "/postgag",
		name: "PostGag",
		component: PostGag,
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
