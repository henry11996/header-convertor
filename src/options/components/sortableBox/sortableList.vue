<template>
	<ol class="list">
		<slot />
	</ol>
</template>

<script>
import { ContainerMixin } from "vue-slicksort";
export default {
	mixins: [ContainerMixin]
};
</script>

<style>
.list {
	margin: 0%;
	font-size: 24px;
	width: 25%;
}
</style>
