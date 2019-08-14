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
	async mounted() {
		this.options = await this.getData(null);
	},
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
	computed: {
		...mapGetters(["sourceHeaders"]),
		headerOrder() {
			let tmp = [];
			for (let i = 0; i < this.headerRules.length; i++) {
				const element = this.headerRules[i];
				tmp.push(element.value);
			}
			return tmp;
		}
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
						title: "請上傳與" + header.origin + "綁定的檔案",
						message:
							"此檔須有" +
							header.value +
							"對應" +
							header.origin +
							"欄位，欄位名稱須一樣",
						key: header.origin,
						value: header.value
					});
				}
			}
		},
		startConvert() {
			this.loadingStart(true);
			this.promtText = "";
			this.convert();
			this.loadingStart(false);
			window.close();
		},
		loadingStart(isStart) {
			if (isStart) {
				this.loading = this.$loading({
					lock: true,
					text: "Loading",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)"
				});
			} else if (this.loading != "") {
				this.loading.close();
			}
		},
		convert() {
			let xlsxName = this.fileList.main.name;
			let sheetName = this.fileList.main.sheets.name;
			let sheet = this.fileList.main.sheets.sheet;
			let newSheet = [];
			//跑每個
			for (let i = 0; i < this.headerRules.length; i++) {
				const header = this.headerRules[i];
				const actionFun = function() {};
				switch (header.action) {
					case "change":
						actionFun = function(row) {
							let val = row[header.origin];
							delete row[header.origin];
							return { [header.value]: val };
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
							return { [header.value]: value };
						};
						break;
					default:
						actionFun = function(row) {
							let value = row[header.value];
							return { [header.value]: value };
						};
				}
				for (let j = 0; j < sheet.length; j++) {
					const row = sheet[j];
					const newRow = actionFun(row);
					if (newSheet[j] == undefined) newSheet[j] = {};
					newSheet[j] = Object.assign(newRow, newSheet[j]);
				}
			}
			this.fileList.main.sheets.sheet = newSheet;
			this.download(this.fileList.main, this.headerOrder);
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
