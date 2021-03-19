<template>
	<form v-on:submit.prevent>
		<h1 v-if="!mod">Poster un gag:</h1>
		<h1 v-else>Modifier le gag:</h1>
		<label for="image">Sélectionner une image*</label>
		<input
			type="file"
			id="image"
			accept="image/*"
			@change="onFileChange"
			:required="!mod"
		/>
		<div v-if="image">
			<img :src="image" />
		</div>
		<label for="description"> Décrire le gag (max. 255 caractères)* </label>
		<textarea
			type="text"
			maxlength="255"
			rows="3"
			id="description"
			v-model="description"
			required
		></textarea>
		<p>Les champs marqués d'une * sont obligatoires.</p>
		<button v-if="!mod" type="submit" @click="postGag">Poster le Gag</button>
		<button v-if="mod" type="submit" @click="modifyGag">Modifier le Gag</button>
		<p>réponse de l'api: {{ response }}</p>
	</form>
</template>

<script>
export default {
	name: "PostGag",
	data() {
		return {
			description: "",
			image: "",
			file: "",
			response: "",
			mod: false,
			gagId: "",
		};
	},
	methods: {
		onFileChange(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length) return;
			this.file = files[0];
			this.createImage(files[0]);
		},
		createImage(file) {
			var reader = new FileReader();
			reader.onload = (e) => {
				this.image = e.target.result;
			};
			reader.readAsDataURL(file);
		},
		postGag() {
			let gag = {
				description: this.description,
				userId: this.$store.state.userId,
			};
			let auth = "bearer " + this.$store.state.token;
			let formData = new FormData();
			formData.append("gag", JSON.stringify(gag));
			formData.append("image", this.file);
			fetch("http://localhost:3000/api/gag", {
				method: "POST",
				headers: {
					Authorization: auth,
					Accept: "application/json",
				},
				body: formData,
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						return "Votre gag a bien été posté !";
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
				});
		},
		modifyGag() {
			let auth = "bearer " + this.$store.state.token;
			let gag = {
				description: this.description,
				userId: this.$store.state.userId,
			};
			let body;
			if (this.file) {
				body = new FormData();
				body.append("gag", JSON.stringify(gag));
				body.append("image", this.file);
			} else {
				body = JSON.stringify(gag);
			}
			let url = "http://localhost:3000/api/gag/" + this.gagId;
			fetch(url, {
				method: "PUT",
				headers: {
					Authorization: auth,
					Accept: "application/json",
				},
				body: body,
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						return "Votre gag a bien été modifié !";
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
				});
		},
	},
	created() {
		if (this.$route.query.mod == true) this.mod = true;
		const gagToModified = this.$store.state.gagMod;
		this.description = gagToModified.description;
		this.image = gagToModified.imageUrl;
		this.gagId = gagToModified.gagId;
	},
};
</script>
