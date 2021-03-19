<template>
	<div :key="componentKey">
		<Gag
			:gagId="$route.params.gagId"
			:gagUserId="gag.userId"
			:pseudo="gag.User.pseudo"
			:createdAt="gag.createdAt"
			:description="gag.description"
			:imageUrl="gag.imageUrl"
			:likes="gag.likes"
			:dislikes="gag.dislikes"
			:isLiked="isLiked"
			:nbComments="gag.nbComments"
			:showComments="showComments"
		/>
	</div>
</template>

<script>
// @ is an alias to /src
import Gag from "@/components/Gag.vue";
import { mapState } from "vuex";
export default {
	name: "OneGag",
	components: {
		Gag,
	},
	data() {
		return {
			gag: "",
			showComments: true,
			response: "",
			componentKey: 0,
		};
	},
	computed: {
		...mapState(["userId", "isAdmin", "token"]),
		isLiked() {
			if (this.gag.Likes[0]) {
				return this.gag.Likes[0].isLiked;
			} else {
				return "";
			}
		},
	},
	created() {
		let auth = "bearer " + this.token;
		let url = "http://localhost:3000/api/gag/" + this.$route.params.gagId;
		fetch(url, {
			method: "GET",
			headers: { Authorization: auth },
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				if (message.error) {
					this.response = message.error;
				} else {
					this.gag = message;
				}
			})
			.catch((error) => {
				this.response = error;
			});
	},
};
</script>
