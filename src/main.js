import Vue from "vue";

// 按需引入 element-ui 组件
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
// 导入样式
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "@/assets/style/reset.css";
import "@/assets/style/global.css";

Vue.prototype.$axios = axios;
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
