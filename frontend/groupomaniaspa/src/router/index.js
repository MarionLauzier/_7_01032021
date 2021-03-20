import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import OneGag from "../views/OneGag.vue";
import PostGag from "../views/PostGag.vue";
import Profile from "../views/Profile.vue";
import Signup from "../components/Signup.vue";
import Login from "../components/Login.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/postgag",
		name: "PostGag",
		component: PostGag,
	},
	{
		path: "/user/:userId",
		name: "Profile",
		component: Profile,
	},
	{
		path: "/signup",
		name: "Signup",
		component: Signup,
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
	{
		path: "/:gagId",
		name: "OneGag",
		component: OneGag,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
