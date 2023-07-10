/* eslint-disable no-unused-vars */
import Vue from "vue";

export const state = Vue.observable({
  isLogin: false,
  userInfo: {}
});

const store = {
  state,

  setLoginStatus(payload) {
    state.isLogin = payload;
    state.userInfo = payload;
  },
  setUserInfo(payload) {
    state.userInfo = payload;
  },
  expireLogin() {
    state.isLogin = false;
    state.userInfo = {};
  }
};
//export default store;

// window.addEventListener("beforeunload", () => {
//   localStorage.setItem("account", JSON.stringify(state));
// });

// window.addEventListener("DOMContentLoaded", () => {
// try {
//   var account = JSON.parse(localStorage.getItem("account"));
// } catch (error) {
//   account = {};
// }
// state.isLogin = account.isLogin;
// state.userInfo = account.userInfo;
// // });
