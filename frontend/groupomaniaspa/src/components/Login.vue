<template>
	<div>
		<Navbar />
		<form v-on:submit.prevent>
			<div>
				<img alt="Groupomania logo" src="../assets/icon-black.png" />
				<p>Veuillez compléter le formulaire suivant:</p>
			</div>
			<label for="email"> Email* </label>
			<input
				id="email"
				type="email"
				v-model="email"
				required
				placeholder="@groupomania.com"
			/>
			<label for="password">Mot de Passe*</label>
			<input type="password" id="password" v-model="password" required />
			<p class="info">Les champs marqués d'un * sont obligatoires</p>
			<button type="submit" @click="login" :disabled="!email || !password">
				S'identifier
			</button>

			<p v-show="$store.state.loginError">
				{{ $store.state.loginError }}
			</p>
		</form>
	</div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
	name: "Login",
	components: { Navbar },
	data() {
		return {
			email: "",
			password: "",
		};
	},
	methods: {
		login() {
			this.$store.dispatch("login", [this.email, this.password]);
		},
	},
};
</script>

<style lang="scss">
form {
	background: white;
	width: 40%;
	box-sizing: border-box;
	margin: 5rem auto 5rem auto;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	box-shadow: 0px 0px 10px #192b48;
	div {
		display: flex;
		justify-content: center;
		//margin-bottom: 1rem;
		img {
			width: 45px;
			max-height: 51px;
			margin: 0 0.5rem 0 0.5rem;
		}
	}
	label {
		margin-top: 1rem;
		align-self: flex-start;
	}
	input {
		margin: 0.5rem 0 0.5rem 0;
		border: none;
		border-bottom: 1px solid #192b48;
		&:focus-visible {
			outline: none;
			border-bottom: 3px solid;
		}
	}
	.info {
		align-self: flex-start;
		margin-top: 0;
		font-size: 0.8rem;
		text-align: left;
	}
	button {
		margin: 0.5rem auto 0 auto;
		padding: 0.5rem 0.8rem;
		color: #192b48;
		border-color: #192b48;
		border-radius: 5px;
		background-color: #ffd7d7;
		font-size: 1rem;
		font-weight: 600;
		font-family: "Blinker", Arial, sans-serif;
		transition: 150ms;

		&:disabled {
			opacity: 0.5;
		}
		&:hover:enabled,
		&:focus:enabled {
			transform: scale(1.05);
		}
	}
}
@media all and (max-width: 1200px) {
	form {
		width: 50%;
	}
}
@media all and (max-width: 991px) {
	form {
		width: 70%;
	}
}
@media all and (max-width: 600px) {
	form {
		width: 100%;
		margin: 2rem auto 2rem auto;
	}
}
</style>
