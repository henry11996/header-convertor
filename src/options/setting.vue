<template>
	<div class="main">
		<div class="rule_control">
			<span>規則管理：</span>
			<el-select v-model="selected" filterable placeholder="請選擇規則">
				<el-option v-for="(item,index) in options" :key="index" :label="index" :value="index"></el-option>
			</el-select>
			<el-input v-model="input" placeholder="请输入内容"></el-input>

			<el-button type="primary" icon="el-icon-check" @click="changeName"></el-button>
			<el-button type="danger" icon="el-icon-delete" @click="deleteName"></el-button>
			<el-button type="success" icon="el-icon-upload2" @click="$refs.file.click()"></el-button>
			<el-button type="info" icon="el-icon-download" @click="exportRule"></el-button>
			<input type="file" ref="file" style="display: none" @change="importRule" />
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import storeService from "./mixins/storeService";
export default {
	data() {
		return {
			options: [],
			selected: "",
			input: ""
		};
	},
	mixins: [storeService],
	mounted() {
		this.init();
	},
	watch: {
		selected() {
			this.input = this.selected;
		}
	},
	computed: {},
	methods: {
		async init() {
			this.options = await this.getData(null);
			if (this.options.length > 0) this.selected = this.options[0];
			this.input = "";
			this.selected = "";
		},
		async changeName() {
			const rule = await this.getData(this.selected);
			this.deleteName(this.selected);
			this.storeData(this.input, rule[this.selected]);
			this.init();
		},
		deleteName() {
			this.deleteData(this.selected);
			this.init();
		},
		importRule(e) {
			let that = this;
			let file = e.target.files[0];
			var reader = new FileReader();
			reader.onload = e => {
				let result = e.target.result;
				result = JSON.parse(result);
				chrome.storage.sync.set(result);
			};
			reader.readAsBinaryString(file);
		},
		exportRule() {
			let that = this;
			this.getData(null).then(result => {
				var a = document.createElement("a");
				var url = window.URL.createObjectURL(
					new Blob([JSON.stringify(result)])
				);
				var filename = "header-conversion.json";
				a.href = url;
				a.download = filename;
				a.click();
			});
		}
	}
};
</script>
<style scoped>
.el-button {
	margin: 0%;
}
.main {
	display: flex;
	justify-content: center;
}
.el-input {
	width: 30%;
}
.rule_control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 85%;
}
span {
	font-size: 14px;
}
</style>