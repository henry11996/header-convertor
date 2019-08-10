<template>
	<div class="xlsx_table">
		<el-select v-model="selectedValue" placeholder="請選擇資料表" no-data-text="無資料(請上傳資料)">
			<el-option-group v-for="(file, index) in soureHeaders" :key="index" :label="file.name">
				<el-option
					v-for="(sheet,id) in file.sheets"
					:key="id"
					:label="sheet.name"
					:value="sheet.header"
				></el-option>
			</el-option-group>
		</el-select>
		<el-table
			ref="multipleTable"
			:data="tableValue"
			tooltip-effect="dark"
			stripe
			border
			size="medium"
			empty-text="請選擇資料表"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="表頭" width="120">
				<template slot-scope="scope">{{ scope.row }}</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	data() {
		return {
			selectedValue: ""
		};
	},
	computed: {
		tableValue() {
			if (this.selectedValue == "") return [];
			return this.selectedValue;
		},
		...mapGetters(["soureHeaders", "headers"])
	},
	methods: {
		handleSelectionChange(value) {
			this.setSelectedHeader(value);
		},
		...mapActions(["setSelectedHeader", "setHeader"])
	}
};
</script>

<style scoped>
.xlsx_table {
	display: flex;
	flex-direction: column;
}
</style>
