import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userId: "10",
		isAdmin: "",
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjE2MTU0ODEyLCJleHAiOjE2MTYxOTgwMTJ9.g-alLwDp2nhExDd3Wc1ecmGtImKQjQC67L1SvAD84kk",
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
