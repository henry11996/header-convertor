<template>
	<div class="upload">
		<el-upload
			class="upload-demo"
			action
			:on-change="handleFile"
			:file-list="fileList"
			accept="xlsx, xls"
		>
			<el-button size type="primary">上傳</el-button>
			<el-select v-model="value" filterable placeholder="編碼方式" no-data-text no-match-text loading-text>
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<div slot="tip" class="el-upload__tip">只能上傳xlsx/xls文件</div>
		</el-upload>
	</div>
</template>
<script>
import { mapActions } from "vuex";
import XlsxService from "../mixins/xlsxService";
export default {
	data() {
		return {
			fileList: [],
			options: [
				{
					value: "950",
					label: "Big-5"
				},
				{
					value: "1209",
					label: "UTF-8"
				}
			],
			value: "950"
		};
	},
	mixins: [XlsxService],
	methods: {
		...mapActions(["setSourceHeader"]),
		async handleFile(file, fileList) {
			if (file.percentage != 100) {
				file.percentage = 100;
				if (file.name.length > 12) file.name = file.name.substring(0, 12);
				let tmp = await this.parse(file.raw, this.value);
				let header = {};
				header["name"] = file.name;
				header["sheets"] = [];
				header["sheets"] = tmp[0];
				console.log(header);
				this.setSourceHeader(header);
			}
		}
	}
};
</script>
<style scoped>
.upload {
	margin-top: 5%;
	display: flex;
	align-content: center;
	justify-content: start;
}
.el-select {
	width: 125px;
}
</style>
