export default {
    methods: {
        getData(key) {
            return new Promise(resolve => {
                if (typeof key != Array && key != null) {
                    let arr = [];
                    arr.push(key);
                    key = arr;
                }
                chrome.storage.sync.get(key, function(result) {
                    let log = key == null ? "Datas" : key;
                    console.log(log + " founded!");
                    resolve(result);
                });
            });
        },
        storeData(key, value) {
            return new Promise(resolve => {
                let obj = {
                    [key]: value
                };
                chrome.storage.sync.set(obj, function() {
                    console.log(key + " saved!");
                    resolve(true);
                });
            });
        },
        deleteData(key) {
            return new Promise(resolve => {
                if (typeof key != Array && key != null) {
                    let arr = [];
                    arr.push(key);
                    key = arr;
                }
                chrome.storage.sync.remove(key, function(result) {
                    console.log(key + " deleted!");
                    resolve(result);
                });
            });
        }
    }
};
