<template>
	<el-tabs type="border-card">
		<el-tab-pane>
			<span slot="label">
				<i class="el-icon-date">資料綁定</i>
			</span>
			<DataBindTab></DataBindTab>
		</el-tab-pane>
		<el-tab-pane label="更多設定">
			<span slot="label">
				<i class="el-icon-s-unfold">更多設定</i>
			</span>
			<Setting></Setting>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import { mapGetters } from "vuex";
import DataBindTab from "./dataBindTab";
import Setting from "./setting";
export default {
	name: "App",
	components: {
		DataBindTab,
		Setting
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
	font-size: 16px;
}
</style>
