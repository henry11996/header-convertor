import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        active: 2,
        sourceHeaders: [],
        headers: [
            { action: "none", value: "A1", example: "abc" },
            { action: "none", value: "B1", example: "bac" },
            { action: "none", value: "C1", example: "cab" }
        ],
        selectedHeaders: []
    },
    getters,
    mutations,
    actions
});
