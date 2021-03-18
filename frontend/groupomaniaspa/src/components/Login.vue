<template>
	<form v-on:submit.prevent>
		<p>Veuillez compléter le formulaire suivant</p>
		<label for="email"> Email* </label>
		<input id="email" type="email" v-model="email" required />
		<label for="password">Mot de Passe*</label>
		<input type="password" id="password" v-model="password" required />
		<button type="submit" @click="login">S'identifier</button>
		<p>
			réponse de l'api: {{ $store.state.loginError }} {{ $store.state.userId }}
		</p>
	</form>
</template>

<script>
export default {
	name: "Login",
	data() {
		return {
			email: "",
			password: "",
		};
	},
	methods: {
		login() {
			this.$store.dispatch("login", [this.email, this.password]);
			//.then redirection
		},
	},
};
</script>

<style></style>
