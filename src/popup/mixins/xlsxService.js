export default {
    data(){
        return{
            loading: ""     
        }
    },
    methods: {
        async parse(file, codepage) {
            return new Promise((resolve, reject) => {
                this.loadingStart(true)
                let that = this
                const XLSX = require("xlsx");
                var datas = [];
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: "binary",
                        codepage
                    });
                    workbook.SheetNames.forEach(name => {
                        let sheet = XLSX.utils.sheet_to_json(
                            workbook.Sheets[name]
                        );
                        if (sheet.length > 0) {
                            datas.push({
                                name,
                                sheet
                            });
                        }
                    });
                    that.loadingStart(false)
                    resolve(datas);
                };
                reader.readAsBinaryString(file);
            });
        },
        download(xlsx, headerOrder) {
            const XLSX = require("xlsx");
            let ws = XLSX.utils.json_to_sheet(xlsx.sheets.sheet, {
                    header: headerOrder
                }),
                wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, xlsx.sheets.name);
            XLSX.writeFile(wb, xlsx.name + "(convert).xlsx");
        },
        takeHeader(datas) {
            let headers = [];
            datas.forEach(value => {
                let header = Object.keys(value.sheet[0]);
                let tmp = {};
                tmp["name"] = value.name;
                tmp["header"] = header;
                headers.push(tmp);
            });
            return headers;
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
    }
};
