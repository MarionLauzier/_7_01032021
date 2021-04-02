<template>
	<div id="nav" :key="componentKey">
		<img alt="Groupomania logo" src="../assets/icon-left-font.png" />
		<nav>
			<router-link to="/" v-if="userId">
				<em class="fas fa-hotel"></em> Accueil</router-link
			>
			<router-link to="/signup" v-if="!userId">
				<em class="fas fa-address-card"></em> S'inscrire</router-link
			>
			<router-link to="/login" v-if="!userId">
				<em class="fas fa-key"></em> Se connecter</router-link
			>
			<a
				:href="$router.resolve({ name: 'PostGag', query: { mod: false } }).href"
				v-if="userId"
			>
				<em class="fas fa-plus-circle"></em> Nouveau Gag
			</a>
			<router-link
				:to="{ name: 'Profile', params: { userId: userId } }"
				v-if="userId"
			>
				<em class="fas fa-user-circle"></em> Profil
			</router-link>
			<a @click="logout" v-if="userId" tabindex="0">
				<em class="fas fa-power-off"></em> Se déconnecter</a
			>
		</nav>
	</div>
</template>

<script>
export default {
	name: "Navbar",
	data() {
		return { userId: this.$store.state.userId, componentKey: 0 };
	},
	methods: {
		logout() {
			this.$store.dispatch("logout");
			if (this.$route.path == "/") {
				this.$router.go();
			} else {
				this.$router.push({ name: "Home" });
			}
		},
	},
};
</script>

<style lang="scss">
#nav {
	padding: 30px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	max-width: 100%;
	box-sizing: border-box;
	background-color: #cde9ff;
	border-bottom: 2px;

	img {
		width: 20%;
		min-width: 200px;
		display: block;
	}
	nav {
		display: flex;
	}
	nav a {
		font-weight: bold;
		margin: auto;
		text-decoration: none;
		color: #192b48;
		padding: 5px;
		transition: all 150ms;
		cursor: pointer;

		&.router-link-exact-active {
			color: #c32240;
			text-decoration: underline;
		}
		&:focus {
			outline: none;
			text-decoration: underline;
		}
		&:hover {
			transform: scale(1.05);
		}
	}
}
@media all and (max-width: 768px) {
	#nav {
		padding: 15px 15px;
		img {
			min-width: 150px;
		}
	}
}
@media all and (max-width: 600px) {
	#nav {
		flex-direction: column;
	}
}
@media all and (max-width: 480px) {
	#nav {
		nav {
			flex-direction: column;
		}
	}
}
</style>
