<template>
	<div>
		<div class="edit_place">
			<el-input v-model="input" placeholder="請選擇資料"></el-input>
			<el-button type="primary" icon="el-icon-edit" circle></el-button>
			<el-button type="warning" icon="el-icon-star-off" circle></el-button>
			<el-button type="danger" icon="el-icon-delete" circle></el-button>
		</div>
		<div class="transfer_btns">
			<el-button type="primary" icon="el-icon-caret-left" circle></el-button>
			<el-button type="primary" icon="el-icon-caret-right" circle></el-button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	data() {
		return {};
	},
	computed: {
		input() {
			return this.selectedHeaders.join();
		},
		...mapGetters(["selectedHeaders"])
	},
	methods: {
		...mapActions([])
	}
};
</script>

<style>
.edit_place {
	display: flex;
}
.transfer_btns {
	display: flex;
}
</style>
