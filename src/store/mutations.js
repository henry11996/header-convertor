import * as types from "./mutation-types";

export default {
    [types.PRE_STEP](state) {
        if (state.active > 0) {
            state.active--;
        }
    },
    [types.NEXT_SETP](state) {
        if (state.active < 2) {
            state.active++;
        }
    },
    [types.SET_SOURCE_HEADER](state, payload) {
        state.sourceHeaders.push(payload);
    },
    [types.SET_HEADER](state, payload) {
        state.headers = payload;
    },
    [types.SET_SELECTED_HEADER](state, payload) {
        state.selectedHeaders = payload;
    },
    [types.ADD_HEADER](state, payload) {
        state.headers.push(payload);
    }
};
