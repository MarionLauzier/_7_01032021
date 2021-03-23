<template>
	<div>
		<Navbar />
		<form v-on:submit.prevent>
			<div>
				<img alt="Groupomania logo" src="../assets/icon-black.png" />
				<p>Veuillez compléter le formulaire suivant :</p>
			</div>
			<label for="email"> Email* </label>
			<input
				id="email"
				type="email"
				v-model="email"
				@input="checkEmail"
				required
			/>
			<p class="info">Utilisez votre email d'entreprise: @groupomania.com</p>
			<p v-if="emailChecked === false" class="alert">
				Cette email n'est pas un email de l'entreprise!
			</p>
			<label for="pseudo">Pseudo*</label>
			<input type="text" id="pseudo" v-model="pseudo" required />
			<label for="password">Mot de Passe*</label>
			<input
				type="password"
				id="password"
				v-model="password"
				@input="checkPasswordStrength"
				required
			/>
			<p class="info">
				Le mot de passe doit contenir entre 8 et 30 caractères, dont au moins 1
				majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et aucun espace.
			</p>
			<p v-if="passwordStrengthChecked === false" class="alert">
				Le mot de passe choisi n'est pas suffisamment fort!
			</p>
			<label for="password2">Confirmez le mot de passe*</label
			><input
				type="password"
				id="password2"
				v-model="password2"
				@input="checkPasswordDiff"
				required
			/>
			<p v-if="passwordDiffChecked === false" class="alert">
				Ce mot de passe n'est pas identique au précédent!
			</p>
			<label for="departement">Département de l'entreprise</label
			><input type="text" id="departement" v-model="departement" />
			<p class="info">Les champs marqués d'une * sont obligatoires.</p>
			<button
				type="submit"
				@click="signup"
				:disabled="!email || !password || !pseudo || !password2"
			>
				S'inscrire
			</button>
			<p v-show="response">{{ response }}</p>
		</form>
	</div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
	name: "Signup",
	components: { Navbar },
	data() {
		return {
			email: "",
			pseudo: "",
			password: "",
			password2: "",
			departement: "",
			response: "",
			emailChecked: "",
			passwordDiffChecked: "",
			passwordStrengthChecked: "",
		};
	},
	methods: {
		signup() {
			const body = {
				email: this.email,
				pseudo: this.pseudo,
				password: this.password,
				departement: this.departement,
			};
			fetch("http://localhost:3000/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						return "Merci pour votre inscription!";
					}
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.response = message;
					}
				})
				.catch((error) => {
					this.response = error;
				})
				.then(() => {
					this.$store.dispatch("login", [this.email, this.password]);
				});
		},
		checkEmail() {
			if (this.email.endsWith("@groupomania.com")) {
				this.emailChecked = true;
			} else {
				this.emailChecked = false;
			}
		},
		checkPasswordDiff() {
			if (this.password2 == this.password) {
				this.passwordDiffChecked = true;
			} else {
				this.passwordDiffChecked = false;
			}
		},
		checkPasswordStrength() {
			const passwordValidator = require("password-validator");
			var passwordCheck = new passwordValidator();
			passwordCheck
				.is()
				.min(8) // Minimum length 8
				.is()
				.max(30) // Maximum length 30
				.has()
				.uppercase() // Must have uppercase letters
				.has()
				.lowercase() // Must have lowercase letters
				.has()
				.digits() // Must have digit
				.has()
				.symbols() // Must have symbol
				.has()
				.not()
				.spaces(); // Should not have spaces},
			this.passwordStrengthChecked = passwordCheck.validate(this.password);
		},
	},
};
</script>
Vérifier mot de passe, et égalité avec mot de passe 2, vérifier email
@groupomania
<style lang="scss">
.alert {
	color: #dd3e5b;
	margin-top: 0;
}
</style>
