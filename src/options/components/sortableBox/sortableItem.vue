<template>
	<li class="list-item">{{item}}</li>
</template>

<script>
import { ElementMixin } from "vue-slicksort";
export default {
	mixins: [ElementMixin],
	props: ["item"]
};
</script>

<style>
.list-item {
	font-size: 24px;
	border-bottom: 1px solid;
}
</style>
