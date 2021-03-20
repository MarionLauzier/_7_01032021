<template>
	<div id="app">
		<nav id="nav">
			<router-link to="/" v-if="userId">Home</router-link>
			<router-link to="/signup" v-if="!userId"> S'inscrire</router-link>
			<router-link to="/login" v-if="!userId">Se connecter</router-link>
			<router-link to="/postgag" v-if="userId"> Nouveau Gag </router-link>
			<router-link :to="{ name: 'Profile', params: { userId: userId } }">
				Profil
			</router-link>
			<a @click="logout" v-if="userId">Se deconnecter</a>
		</nav>
		<router-view />
	</div>
</template>

<script>
export default {
	data() {
		return { userId: this.$store.state.userId };
	},
	methods: {
		logout() {
			this.$store.dispatch("logout");
			this.$router.push({ name: "Home" });
		},
	},
};
</script>
<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
