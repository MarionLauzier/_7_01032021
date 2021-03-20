<template>
	<nav id="nav">
		<router-link to="/" v-if="userId">Home</router-link>
		<router-link to="/signup" v-if="!userId"> S'inscrire</router-link>
		<router-link to="/login" v-if="!userId">Se connecter</router-link>
		<router-link to="/postgag" v-if="userId"> Nouveau Gag </router-link>
		<router-link
			:to="{ name: 'Profile', params: { userId: userId } }"
			v-if="userId"
		>
			Profil
		</router-link>
		<a @click="logout" v-if="userId">Se deconnecter</a>
	</nav>
</template>

<script>
export default {
	name: "Navbar",
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
