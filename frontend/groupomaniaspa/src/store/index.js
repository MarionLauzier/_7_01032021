import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userId: "2",
		isAdmin: "",
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2MTY0Nzg5NzAsImV4cCI6MTYxNjUyMjE3MH0.Ucc7EFC7QXXh6e2xDBsTXKbqkc4HfauxB23k8bD2sWs",
		loginError: "",
		gagMod: "",
	},
	mutations: {
		SET_USER(state, payload) {
			state.userId = payload.userId;
			state.isAdmin = payload.isAdmin;
			state.token = payload.token;
		},
		SET_LOGINERROR(state, payload) {
			state.loginError = payload;
		},
		CLEAR_STORE(state) {
			state.userId = "";
			state.isAdmin = "";
			state.token = "";
			state.loginError = "";
		},
		SET_GAG_MOD(state, payload) {
			state.gagMod = payload;
		},
	},
	actions: {
		login(context, [email, password]) {
			context.commit("CLEAR_STORE");
			const body = {
				email: email,
				password: password,
			};
			fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			})
				.then((res) => {
					return res.json();
				})
				.then((message) => {
					if (message.error) {
						context.commit("SET_LOGINERROR", message.error);
					} else {
						context.commit("SET_USER", message);
						router.push({ name: "Home" });
					}
				})
				.catch((error) => {
					context.commit("SET_LOGINERROR", error);
				});
		},
		logout(context) {
			context.commit("CLEAR_STORE");
		},
		saveGag(context, gag) {
			context.commit("SET_GAG_MOD", gag);
		},
	},
	modules: {},
});
