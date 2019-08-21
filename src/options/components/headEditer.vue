<template>
	<div class="main">
		<div class="transfer_btns">
			<el-button
				type="primary"
				icon="el-icon-caret-top"
				@click="positionControl('up')"
				circle
				:disabled="multipleSelection.length !== 1"
			></el-button>
			<el-button
				type="primary"
				icon="el-icon-caret-bottom"
				@click="positionControl('down')"
				circle
				:disabled="multipleSelection.length !== 1"
			></el-button>
		</div>
		<el-table
			ref="multipleTable"
			:data="headers"
			tooltip-effect="dark"
			@selection-change="handleSelectionChange"
			empty-text="無資料"
			stripe
			max-height="500px"
		>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="表頭" width="200">
				<template slot-scope="scope">{{ scope.row.value }}</template>
			</el-table-column>
			<el-table-column label="範例資料" width="200">
				<template slot-scope="scope">{{ scope.row.example }}</template>
			</el-table-column>
			<el-table-column label="方式" width="120">
				<template slot-scope="scope">
					<el-tooltip
						v-if="scope.row.action == 'replace'"
						class="item"
						effect="dark"
						:content="'Replace count:'+scope.row.origin.length"
						placement="top-start"
					>
						<el-badge is-dot class="item">{{scope.row.action}}</el-badge>
					</el-tooltip>
					<span v-else>{{ scope.row.action }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="edit_place">
			<el-input v-model="editInput" placeholder="請在左邊選擇資料" disabled></el-input>
			<el-select v-model="selectedOption" placeholder="選擇方法">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<div v-if="selectedOption == 'change'  && multipleSelection.length > 0  " class="change">
				<el-input v-model="input" placeholder="輸入修改的名字"></el-input>
			</div>
			<div v-else-if="selectedOption == 'merge' && multipleSelection.length > 1">
				<el-input v-model="input" placeholder="輸入要合併的方式"></el-input>
			</div>
			<div v-else-if="selectedOption == 'key-value' && multipleSelection.length == 1">
				<el-input v-model="input" placeholder="對應的欄位名稱"></el-input>
			</div>
			<div v-else-if="selectedOption == 'replace' && multipleSelection.length > 0">
				<el-input v-model="input" placeholder="輸入要取代的字串"></el-input>
				<el-input v-model="addition" placeholder="輸入要取代成的字串"></el-input>
			</div>
			<div class="edit_button">
				<el-button type="primary" icon="el-icon-refresh-left" circle @click="edit('restore')"></el-button>
				<el-button type="warning" icon="el-icon-check" circle @click="edit('ok')"></el-button>
				<el-button type="danger" icon="el-icon-delete" circle @click="edit('remove')"></el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
	data() {
		return {
			multipleSelection: [],
			options: [
				{
					value: "change",
					label: "改名"
				},
				// {
				// 	value: "merge",
				// 	label: "合併"
				// },
				{
					value: "key-value",
					label: "對應值"
				},
				{
					value: "replace",
					label: "取代"
				}
			],
			selectedOption: "change",
			input: "",
			addition: "",
			placeHolder: ""
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
			return this.headers.map(item => {
				return item.value;
			});
		},
		...mapGetters(["headers"])
	},
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		positionControl(direction) {
			let header = this.headers;
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				header.splice(index, 1);
				if (direction == "up") {
					header.splice(index - 1, 0, item);
				} else {
					header.splice(index + 1, 0, item);
				}
			});
			console.log(header);
			this.setHeader(header);
		},
		edit(type) {
			if (this.multipleSelection.length < 1)
				this.notify("必須選擇一個欄位", "", "warning");
			if (type == "ok" && this.input == "")
				return this.notify("請輸入文字", "", "warning");
			let indexs = this.headerIndexs;
			this.multipleSelection.forEach(item => {
				let index = indexs.indexOf(item.value);
				let header = this.headers[index];
				switch (type) {
					case "restore":
						this.restore(header);
						break;
					case "remove":
						this.remove(header);
						break;
					case "ok":
						this.action(header, index);
						break;
				}
			});
			this.input == "";
		},
		restore(header) {
			this.popHistory(header);
		},
		remove(header) {
			this.pushHistory(header);
			header.action = "delete";
		},
		action(header, index) {
			switch (this.selectedOption) {
				case "change":
					this.changeName(header);
					break;
				case "merge":
					if (this.multipleSelection.length > 1) break;
					this.mergeColumn(header);
					break;
				case "key-value":
					if (this.multipleSelection.length != 1) break;
					this.keyValue(header, index);
					break;
				case "replace":
					this.replaceValue(header);
					break;
			}
		},
		changeName(header) {
			this.pushHistory(header);
			header.action = "change";
			header.origin = header.value;
			header.value = this.input;
			this.$refs.multipleTable.clearSelection();
		},
		mergeColumn(header) {
			this.pushHistory(header);
			header.action = "merge";
			header.origin = header.value;
			header.value = this.input;
			this.$refs.multipleTable.clearSelection();
		},
		keyValue(header, index) {
			// this.pushHistory(header);
			this.addNewHeader(header, index);
			header.action = "key-value";
			header.origin = header.value; //key
			header.value = this.input; //value
			header.example = "key:" + header.origin + ",value:" + header.value;
			this.$refs.multipleTable.clearSelection();
		},
		replaceValue(header) {
			this.pushHistory(header);
			if (header.action != "replace") {
				header.action = "replace";
				header.origin = [
					{
						search: this.input,
						replace: this.addition
					}
				];
				header.example = header.example.replace(this.input, this.addition);
			} else {
				header.origin.push({
					search: this.input,
					replace: this.addition
				});
			}
			this.$refs.multipleTable.clearSelection();
		},
		addNewHeader(header, index) {
			const newHead = Object.assign({}, header);
			this.addHeader({ header: newHead, position: index });
		},
		pushHistory(header) {
			let tmp = Object.assign({}, header);
			header["history"] != undefined
				? header["history"].push(tmp)
				: (header["history"] = [tmp]);
		},
		popHistory(header) {
			if (header["history"] != undefined && header["history"].length > 0) {
				let now = header["history"].pop();
				header.action = now.action;
				header.example = now.example;
				header.origin = now.origin;
				header.history = now.history;
				header.value = now.value;
			}
		},
		notify(title, message, type = "success") {
			this.$notify({
				title,
				message,
				type
			});
		},
		...mapActions(["addHeader", "setHeader"])
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
