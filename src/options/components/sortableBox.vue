<template>
	<SortableList lockAxis="y" v-model="headers" @input="test">
		<SortableItem v-for="(item, index) in headers" :index="index" :key="index" :item="item" />
	</SortableList>
</template>

<script>
import SortableItem from "./sortableBox/sortableItem";
import SortableList from "./sortableBox/sortableList";
import { mapGetters } from "vuex";
export default {
	data() {
		return {};
	},
	components: {
		SortableItem,
		SortableList
	},
	computed: mapGetters(["headers"]),
	methods: {
		test() {
			console.log(this.headers);
		}
	}
};
</script>

<style>
</style>
