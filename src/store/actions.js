import * as types from "./mutation-types";

export const preStep = ({ commit }) => {
    commit(types.PRE_STEP);
};
export const nextStep = ({ commit }) => {
    commit(types.NEXT_SETP);
};
export const setSourceHeader = ({ commit }, payload) => {
    commit(types.SET_SOURCE_HEADER, payload);
};
export const setHeader = ({ commit }, payload) => {
    commit(types.SET_HEADER, payload);
};
export const setSelectedHeader = ({ commit }, payload) => {
    commit(types.SET_SELECTED_HEADER, payload);
};
