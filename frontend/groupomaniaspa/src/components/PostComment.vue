<template>
	<div>
		<label for="content"> Votre commentaire (max. 255 caractères): </label>
		<textarea
			type="text"
			maxlength="255"
			rows="3"
			id="content"
			v-model="content"
		></textarea>
		<button type="button" @click="postComment" :disabled="!content">
			<i class="fas fa-comment-alt"></i>Commenter
		</button>
		<p>{{ response }} la réponse</p>
	</div>
</template>

<script>
export default {
	name: "PostComment",
	props: ["gagId"],
	data() {
		return {
			content: "",
			response: "",
		};
	},
	methods: {
		postComment() {
			const body = { userId: this.$store.state.userId, content: this.content };
			let auth = "bearer " + this.$store.state.token;
			let url = "http://localhost:3000/api/gag/" + this.gagId + "/comment";
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: auth },
				body: JSON.stringify(body),
			})
				.then((res) => {
					if (!res.ok) {
						return res.json();
					} else {
						return "Votre commentaire a été posté !";
					}
				})
				.then((message) => {
					if (message.error) {
						this.response = message.error;
					} else {
						this.response = message;
						this.content = "";
						this.$emit("reload-comments");
					}
				})
				.catch((error) => {
					this.response = error;
				});
		},
	},
};
</script>

<style></style>
