export default {
    methods: {
        async parse(file, codepage) {
            return new Promise((resolve, reject) => {
                const XLSX = require("xlsx");
                var datas = [];
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: "binary",
                        sheetRows: 2,
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
                    resolve(datas);
                };
                reader.readAsBinaryString(file);
            });
        },
        takeHeader(datas) {
            let headers = [];
            datas.forEach(value => {
                let header = Object.keys(value.sheet[0]);
                let tmp = {};
                tmp["name"] = value.name;
                tmp["header"] = header;
                tmp["example"] = value.sheet[0];
                headers.push(tmp);
            });
            return headers;
        }
    }
};
