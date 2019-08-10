import * as types from "./mutation-types";
import { type } from "os";

export default {
    [types.PRE_STEP](state) {
        if (state.active > 0) {
            state.active--;
        }
    },
    [types.NEXT_SETP](state) {
        if (state.active < 3) {
            state.active++;
        }
    },
    [types.SET_SOURCE_HEADER](state, payload) {
        state.soureHeaders.push(payload);
    },
    [types.SET_HEADER](state, payload) {
        state.headers = payload;
    },
    [types.SET_SELECTED_HEADER](state, payload) {
        state.selectedHeaders = payload;
    }
};
