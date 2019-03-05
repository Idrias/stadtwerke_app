<template>
	<div class="shadow" id="buttonbar">
		<div
			v-for="cat in getCategories()"
			v-bind:key="cat.id"
			v-on:click="$emit('categorySelected',cat)"
			v-bind:class="{ selected: selectedCategory== cat }"
			class="button"
			v-bind:id="cat.name"
		>{{ cat.name }}</div>
	</div>
</template>

<script>
	export default {
		name: "ButtonBar",
		props: {
			categories: Array,
			selectedCategory: Object
		},
		data() {
			return {};
		},
		methods: {
			getCategories() {
				return this.categories
					? this.categories
					: this.$root.$data.sharedState.categories;
			}
		}
	};
</script>

<style scoped>
	.button {
		float: left;
		flex: 1;
		border-right: 1px solid;
		display: grid;
		align-content: center;
		background-color: var(--c2);
		transition: background-color 0.4s ease-in-out;
	}

	.button:hover {
		background-color: var(--c2hover);
		cursor: pointer;
	}

	.selected {
		background-color: var(--c2high) !important;
	}

	#buttonbar {
		height: 5%;
		max-height: 40px;
		min-height: 30px;
		width: 100%;
		background-color: green;
		display: flex;
		margin-bottom: 10px;
	}
</style>
