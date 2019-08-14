<template>
	<div>
		<div class="main">
			<el-select v-model="selected" filterable placeholder="請選擇規則" @change="ruleChange">
				<el-option v-for="(item,index) in options" :key="index" :label="index" :value="index"></el-option>
			</el-select>
			<span v-if="selected != '' && promtText != ''">
				<el-tooltip class="item" effect="dark" :content="promtText.message" placement="top-start">
					<el-badge is-dot class="item">{{promtText.title}}</el-badge>
				</el-tooltip>
			</span>
			<xlsx-upload v-if="selected.length != ''&& promtText != '' "></xlsx-upload>
		</div>
		<div class="buttom">
			<el-button type="primary" @click="optionPage" round>選項</el-button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import xlsxUpload from "./components/xlsxUpload";
import storeService from "./mixins/storeService";
import xlsxService from "./mixins/xlsxService";
export default {
	data() {
		return {
			options: [],
			selected: "",
			headerRules: [],
			fileCount: 0,
			fileList: {},
			promtText: {
				title: "請上傳主檔",
				message: "上傳主要要轉換的檔案",
				key: "main"
			},
			promtTextList: [],
			loading: ""
		};
	},
	components: {
		xlsxUpload
	},
	mixins: [storeService, xlsxService],
	async mounted() {
		this.options = await this.getData(null);
	},
	computed: {
		...mapGetters(["sourceHeaders"])
	},
	watch: {
		sourceHeaders() {
			if (this.sourceHeaders.length > 0)
				this.fileCount = this.sourceHeaders.length - 1;
			this.fileList[this.promtText.key] = this.sourceHeaders[this.fileCount];
			if (this.promtTextList.length == 0) {
				this.startConvert();
			} else if (this.promtTextList.length > 0) {
				this.promtText = this.promtTextList.shift();
			}
		}
	},
	methods: {
		...mapActions(["setSourceHeader"]),
		optionPage() {
			chrome.runtime.openOptionsPage();
		},
		ruleChange() {
			this.headerRules = this.options[this.selected];
			for (let index = 0; index < this.headerRules.length; index++) {
				const header = this.headerRules[index];
				if (header.action == "key-value") {
					this.promtTextList.push({
						title: "請上傳與" + header.value + "綁定的檔案",
						message:
							"請上傳與" + header.value + "=>" + header.origin + "綁定的檔案",
						key: header.origin,
						value: header.value
					});
				}
			}
		},
		startConvert() {
			this.loading = this.$loading({
				lock: true,
				text: "Loading",
				spinner: "el-icon-loading",
				background: "rgba(0, 0, 0, 0.7)"
			});
			this.promtText = "";
			this.convert();
			this.loading.close();
			window.close();
		},
		convert() {
			let xlsxName = this.fileList.main.name;
			let sheetName = this.fileList.main.sheets.name;
			let sheet = this.fileList.main.sheets.sheet;
			for (let i = 0; i < this.headerRules.length; i++) {
				const header = this.headerRules[i];
				const action = header.action;
				const actionFun = function() {};
				switch (action) {
					case "change":
						actionFun = function(row) {
							let val = row[header.origin];
							delete row[header.origin];
							row[header.value] = val;
						};
						break;
					case "key-value":
						let keySheet = this.fileList[header.origin].sheets.sheet;
						let keyValueKeySheet = [];
						keySheet.forEach((value, index) => {
							keyValueKeySheet[value[header.origin]] = value[header.value];
						});
						actionFun = function(row) {
							let value = keyValueKeySheet[row[header.origin]];
							row[header.value] = value;
						};
						break;
					case "delete":
						actionFun = function(row) {
							delete row[header.value];
						};
						break;
				}
				for (let j = 0; j < sheet.length; j++) {
					const row = sheet[j];
					actionFun(row);
				}
			}
			let headerOrder = [];
			for (let i = 0; i < this.headerRules.length; i++) {
				const element = this.headerRules[i];
				headerOrder.push(element.value);
			}
			this.download(this.fileList.main, headerOrder);
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 200px;
	height: 300px;
	display: flex;
	flex-direction: column;
	align-content: center;
}
span {
	margin-top: 5%;
	text-align: center;
	font-size: 14px;
}
.buttom {
	height: 50px;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
}
</style>
