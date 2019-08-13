import Vue from "vue";
import App from "./App";
import store from "../store";
import {
    Button,
    Select,
    Upload,
    Option,
    OptionGroup,
    Badge,
    Tooltip
} from "element-ui";
Vue.use(Button);
Vue.use(Select);
Vue.use(Upload);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Badge);
Vue.use(Tooltip);

global.browser = require("webextension-polyfill");
Vue.prototype.$browser = global.browser;

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
