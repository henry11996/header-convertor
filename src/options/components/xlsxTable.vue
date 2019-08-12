<template>
	<div class="xlsx_table">
		<span>請選擇要使用的表頭</span>
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
		<el-transfer
			v-model="transferData"
			:data="dataValues"
			:titles="['Source', 'Target']"
			empty-text="無資料(請上傳資料)"
			@change="handleSelectionChange"
		></el-transfer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	data() {
		return {
			selectedValue: [],
			dataValues: [],
			transferData: this.headers
		};
	},
	watch: {
		selectedValue() {
			if (typeof this.selectedValue == "object") {
				let len = this.dataValues.length;
				this.selectedValue.forEach((label, key) => {
					this.dataValues.push({
						key: key + len,
						label,
						disabled: false
					});
				});
			}
		}
	},
	computed: {
		...mapGetters(["soureHeaders", "headers"])
	},
	methods: {
		handleSelectionChange() {
			let tmp = [];
			this.dataValues.forEach((value, index) => {
				if (this.transferData.includes(value.key)) {
					tmp.push({
						action: "none",
						value: value.label
					});
				}
			});
			this.setHeader(tmp);
		},
		filterMethod() {},
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
