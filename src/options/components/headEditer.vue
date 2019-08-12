<template>
	<div class="main">
		<div class="transfer_btns">
			<el-button type="primary" icon="el-icon-caret-top" @click="positionControl('up')" circle></el-button>
			<el-button type="primary" icon="el-icon-caret-bottom" @click="positionControl('down')" circle></el-button>
		</div>
		<el-table
			ref="multipleTable"
			:data="testHeaders"
			tooltip-effect="dark"
			@selection-change="handleSelectionChange"
			empty-text="無資料"
			stripe
		>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="表頭" width="100">
				<template slot-scope="scope">{{ scope.row.value }}</template>
			</el-table-column>
			<el-table-column label="方式" width="100">
				<template slot-scope="scope">{{ scope.row.action }}</template>
			</el-table-column>
		</el-table>
		<div class="edit_place">
			<el-input v-model="editInput" placeholder="請在左邊選擇資料" disabled></el-input>
			<el-select v-model="selectedOption" placeholder="選擇方法">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<div v-if="selectedOption == 'change' && multipleSelection.length != 0  " class="change">
				<el-input v-model="changeNameValue" placeholder="輸入修改的名字"></el-input>
			</div>
			<div class="edit_button">
				<el-button type="primary" icon="el-icon-refresh-left" circle @click="restore"></el-button>
				<el-button type="warning" icon="el-icon-check" circle @click="action"></el-button>
				<el-button type="danger" icon="el-icon-delete" circle @click="remove"></el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	data() {
		return {
			multipleSelection: [],
			options: [
				{
					value: "change",
					label: "改名"
				},
				{
					value: "merge",
					label: "合併"
				},
				{
					value: "key-value",
					label: "對應值"
				}
			],
			selectedOption: "change",
			changeNameValue: ""
		};
	},
	computed: {
		editInput() {
			let show = this.multipleSelection.map(item => {
				return item.value;
			});
			return show.join();
		},
		headerIndexs() {
			return this.testHeaders.map(item => {
				return item.value;
			});
		},
		...mapGetters(["headers", "testHeaders"])
	},
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		positionControl(direction) {
			let tmp = this.testHeaders;
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				tmp.splice(index, 1);
				if (direction == "up") {
					tmp.splice(index - 1, 0, item);
				} else {
					tmp.splice(index + 1, 0, item);
				}
			});
			console.log(tmp);
			this.setTestHeader(tmp);
		},
		restore() {
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				let tmp = this.testHeaders[index];
				if (tmp.action != "none") {
					tmp.action = "none";
					tmp.value = tmp.old;
					delete tmp.new;
					delete tmp.old;
				}
			});
		},
		remove() {
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				let tmp = this.testHeaders[index];
				tmp.action = "delete";
				tmp["old"] = tmp.value;
			});
		},
		action() {
			switch (this.selectedOption) {
				case "change":
					this.changeName();
					break;
				case "merge":
					this.mergeColumn();
					break;
				case "key-value":
					this.keyValue();
					break;
			}
		},
		changeName() {
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				let tmp = this.testHeaders[index];
				if (tmp.action != "change") {
					tmp.action = "change";
					tmp["old"] = tmp.value;
					tmp["new"] = this.changeNameValue;
					tmp.value = tmp["new"];
				} else {
					tmp["new"] = this.changeNameValue;
					tmp.value = tmp["new"];
				}
			});
		},
		mergeColumn() {
			let indexs = this.headerIndexs;
			if (this.multipleSelection.length < 2) {
				// this.call("低於2個", "請選擇兩個以上", "warning");
				return;
			}
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				let tmp = this.testHeaders[index];
				if (tmp.action != "merge") {
					tmp.action = "merge";
					tmp["old"] = tmp.value;
					tmp["new"] = this.changeNameValue;
					tmp.value = tmp["new"];
				} else {
					tmp["new"] = this.changeNameValue;
					tmp.value = tmp["new"];
				}
			});
		},
		keyValue() {},
		call(title, message, type = "success") {
			this.$notify({
				title,
				message,
				type
			});
		},
		...mapActions(["setTestHeader"])
	}
};
</script>

<style scoped>
.main {
	margin: 20px;
	display: flex;
	justify-content: center;
}
.edit_place {
	display: flex;
	margin-left: 20px;
	justify-content: start;
	flex-direction: column;
}
.edit_button {
	margin-top: 10px;
	display: flex;
	justify-content: space-around;
}
.transfer_btns {
	display: flex;
	align-content: center;
	justify-content: space-around;
	flex-direction: column;
	margin-right: 10px;
}
.el-table {
	flex: inherit;
	width: auto;
}
.el-button {
	margin: 0%;
}
</style>
