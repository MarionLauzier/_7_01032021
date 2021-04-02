<template>
	<div class="postcomment">
		<label :for="'content_' + gagId">
			<img class="logo" alt="Groupomania logo" src="../assets/icon-black.png" />
			Votre commentaire (max. 255 caractères):
		</label>

		<textarea
			maxlength="255"
			rows="2"
			:id="'content_' + gagId"
			v-model="content"
		></textarea>
		<button type="button" @click="postComment" :disabled="!content">
			<em class="fas fa-comment-alt"></em> Commenter
		</button>

		<p>{{ response }}</p>
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

<style lang="scss">
.postcomment {
	padding: 1rem 2rem 0rem 2rem;
	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.2rem;
	}
	button {
		margin: 0.5rem auto 0 auto;
		padding: 0.3rem 0.5rem;
		color: #192b48;
		border-color: #192b48;
		border-radius: 5px;
		background-color: #ffd7d7;
		font-size: 1rem;
		font-weight: 600;
		font-family: "Blinker", Arial, sans-serif;
		transition: transform 150ms;

		&:disabled {
			opacity: 0.5;
		}
		&:hover:enabled,
		:focus:enabled {
			transform: scale(1.05);
		}
	}
	p {
		margin: 0.2rem;
	}
}
</style>
