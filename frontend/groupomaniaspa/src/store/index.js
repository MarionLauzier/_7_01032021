import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userId: "2",
		isAdmin: "",
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2MTU5NjA3MDksImV4cCI6MTYxNjAwMzkwOX0.HvSnBPLaM326VHIrq74dT-u3d-5EJk9mU4hIy2Z-lSI",
		loginError: "",
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
					}
				})
				.catch((error) => {
					context.commit("SET_LOGINERROR", error);
				});
		},
		logout(context) {
			context.commit("CLEAR_STORE");
		},
	},
	modules: {},
});
