<template>
	<div class="main">
		<el-select v-model="selected" filterable placeholder="請選擇規則" @change="ruleChange">
			<el-option v-for="(item,index) in options" :key="index" :label="index" :value="index"></el-option>
		</el-select>
		<span v-if="selected != ''">
			<el-tooltip class="item" effect="dark" :content="promtText.message" placement="top-start">
				<el-badge is-dot class="item">{{promtText.title}}</el-badge>
			</el-tooltip>
		</span>
		<xlsx-upload v-if="selected.length != '' "></xlsx-upload>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import xlsxUpload from "./components/xlsxUpload";
import saveService from "./mixins/saveService";
import xlsxService from "./mixins/xlsxService";
export default {
	data() {
		return {
			options: [],
			selected: "",
			fileCount: 0,
			promtText: { title: "請上傳主檔", message: "上傳主要要轉換的檔案" },
			promtTextList: []
		};
	},
	components: {
		xlsxUpload
	},
	mixins: [saveService, xlsxService],
	async mounted() {
		this.options = await this.getData(null);
	},
	computed: {
		...mapGetters(["sourceHeaders"])
	},
	watch: {
		sourceHeaders() {
			this.sourceHeaders != undefined
				? (this.fileCount = this.sourceHeaders.length)
				: (this.fileCount = 0);
			console.log(this.promtTextList);
			if (this.promtTextList.length > 0)
				this.promtText = this.promtTextList.shift();
			console.log(this.fileCount, this.promtTextList);
		}
	},
	methods: {
		...mapActions(["setSourceHeader"]),
		ruleChange() {
			let headerRules = this.options[this.selected];
			for (let index = 0; index < headerRules.length; index++) {
				const header = headerRules[index];
				if (header.action == "key-value") {
					this.promtTextList.push({
						title: "請上傳與" + header.value + "綁定的檔案",
						message:
							"請上傳與" + header.value + "=>" + header.addition + "綁定的檔案"
					});
				}
			}
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
</style>
