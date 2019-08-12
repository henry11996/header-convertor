global.browser = require("webextension-polyfill");

import Vue from "vue";
import App from "./App";
import store from "../store";

import {
    Button,
    Select,
    Upload,
    Tabs,
    TabPane,
    TableColumn,
    Table,
    Steps,
    Step,
    Option,
    OptionGroup,
    Input,
    Transfer,
    Notification
} from "element-ui";
Vue.use(Button);
Vue.use(Select);
Vue.use(Upload);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Input);
Vue.use(Transfer);
Vue.use(Notification);
new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
