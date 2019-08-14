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
			<!-- <sortable-box></sortable-box> -->
		</div>
		<div class="but">
			<el-button type="primary" plain @click="preStep" :disabled="active==0">上一步</el-button>
			<el-button type="primary" plain @click="nextStep" v-if="active!=2" :disabled="active==2">下一步</el-button>
			<el-button type="danger" plain @click="save" v-if="active==2" :disabled="!canSave">儲存</el-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import XlsxUpload from "./components/xlsxUpload.vue";
import XlsxTable from "./components/xlsxTable.vue";
import HeadEditer from "./components/headEditer";
import SortableBox from "./components/sortableBox.vue";
import storeService from "./mixins/storeService";
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
	mixins: [storeService],
	computed: {
		...mapGetters(["active", "headers"]),
		canSave() {
			if (this.headers.length > 0) {
				return true;
			}
			return false;
		}
	},
	methods: {
		...mapActions(["preStep", "nextStep"]),
		async save() {
			let that = this;
			this.$prompt("請輸入規則名稱", "儲存", {
				confirmButtonText: "確認",
				cancelButtonText: "取消"
			})
				.then(async ({ value }) => {
					await that.storeData(value, that.headers);
					that.$notify({
						title: "規則: " + value + "儲存成功",
						type: "success"
					});
				})
				.catch(e => {
					that.$notify({
						title: "規則: " + "儲存失敗",
						message: e,
						type: "warning"
					});
				});
		}
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
