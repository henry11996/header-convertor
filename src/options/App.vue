<template>
	<el-tabs type="border-card">
		<el-tab-pane>
			<span slot="label">
				<i class="el-icon-date"></i> 資料綁定
			</span>
			<DataBindTab></DataBindTab>
		</el-tab-pane>
		<el-tab-pane label="更多設定">更多設定</el-tab-pane>
	</el-tabs>
</template>

<script>
import { mapGetters } from "vuex";
import DataBindTab from "./dataBindTab";
export default {
	name: "App",
	components: {
		DataBindTab
	},
	computed: {},
	data() {
		return {};
	}
};
</script>

<style scoped>
.el-tabs {
	margin: 0px;
}
.el-icon-date {
	font-size: 24px;
}
</style>
