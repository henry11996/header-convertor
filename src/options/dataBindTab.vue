<template>
	<div>
		<el-steps :active="active" simple>
			<el-step title="步驟 1 - 資料上傳" icon="el-icon-upload"></el-step>
			<el-step title="步驟 2 - 資料整理" icon="el-icon-edit"></el-step>
			<el-step title="步驟 3 - 資料綁定" icon="el-icon-document-copy"></el-step>
		</el-steps>
		<div v-if="active == 0" class="step_1">
			<xlsx-upload></xlsx-upload>
		</div>
		<div v-if="active == 1" class="step_2">
			<xlsx-table></xlsx-table>
		</div>
		<div v-if="active == 2" class="step_3">
			<head-editer></head-editer>
			<sortable-box></sortable-box>
		</div>
		<div class="but">
			<el-button type="primary" plain @click="preStep" :disabled="active==0">上一步</el-button>
			<el-button type="primary" plain @click="nextStep" :disabled="active==2">下一步</el-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import XlsxUpload from "./components/xlsxUpload.vue";
import XlsxTable from "./components/xlsxTable.vue";
import HeadEditer from "./components/headEditer";
import SortableBox from "./components/sortableBox.vue";
export default {
	data() {
		return {};
	},
	components: {
		XlsxUpload,
		SortableBox,
		XlsxTable,
		HeadEditer
	},
	computed: {
		...mapGetters(["active"])
	},
	methods: {
		...mapActions(["preStep", "nextStep"])
	}
};
</script>

<style scoped>
.main {
	display: flex;
}
.but {
	text-align: center;
}
.step_2 {
	margin: 10px;
	display: flex;
	justify-content: center;
}
</style>
>
</style>
