<template>
	<div>
		<div class="info_2">
			<ul>
				<li>使用說明</li>
				<ol>
					<li>選擇要使用的表頭即可往下一步</li>
				</ol>
			</ul>
		</div>
		<div class="xlsx_table">
			<span>請選擇要使用的表頭</span>
			<el-select v-model="selectedValue" placeholder="請選擇資料表" no-data-text="無資料(請上傳資料)">
				<el-option-group v-for="(file, index) in sourceHeaders" :key="index" :label="file.name">
					<el-option v-for="(sheet,id) in file.sheets" :key="id" :label="sheet.name" :value="sheet"></el-option>
				</el-option-group>
			</el-select>
			<el-transfer
				v-model="transferData"
				:data="dataValues"
				filterable
				filter-placeholder="輸入要查詢內容"
				:titles="['未選擇區域', '已選擇區域']"
				empty-text="無資料(請上傳資料)"
				@change="handleTransferChange"
			></el-transfer>
		</div>
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
				this.selectedValue.header.forEach((label, key) => {
					this.dataValues.push({
						key: key + len,
						label,
						example: this.selectedValue.example[label],
						disabled: false
					});
				});
			}
		}
	},
	computed: {
		...mapGetters(["sourceHeaders", "headers"])
	},
	methods: {
		handleTransferChange() {
			let tmp = [];
			this.dataValues.forEach((value, index) => {
				if (this.transferData.includes(value.key)) {
					tmp.push({
						action: "none",
						value: value.label,
						example: value.example
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

<style>
.xlsx_table {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.el-select {
	width: 40vw;
}
.el-transfer {
	margin: 10px;
}
.el-transfer-panel__body {
	height: 58vh;
}
.el-transfer-panel__list {
	/* height: fit-content !important; */
	height: 50vh !important;
}
.el-transfer-panel__filter {
	width: fit-content;
}
.info_2 {
	color: gray;
	width: 19vw;
	margin-top: 29vh;
	position: absolute;
	float: left;
	font-size: 13px;
	border: 1px solid;
	padding: 0px;
}
</style>
