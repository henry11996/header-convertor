import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        active: 2,
        soureHeaders: [],
        headers: [],
        selectedHeaders: [],
        testHeaders: [
            {
                action: "none",
                value: "a"
            },
            {
                action: "none",
                value: "b"
            },
            {
                action: "none",
                value: "c"
            },
            {
                action: "none",
                value: "d"
            },
            {
                action: "none",
                value: "e"
            },
            {
                action: "none",
                value: "f"
            },
            {
                action: "none",
                value: "g"
            },
            {
                action: "none",
                value: "h"
            }
        ]
    },
    getters,
    mutations,
    actions
});
