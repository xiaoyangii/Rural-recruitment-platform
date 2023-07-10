import Vue from "vue";
import VueRouter from "vue-router";
import pathArr from "@/router/pathArr.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../view/Home.vue")
  },
  {
    // 登录
    path: "/user",
    name: "user",
    component: () => import("../view/User.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../view/Register.vue")
  },
  {
    path: "/progressquery",
    name: "ProgressQuery",
    component: () => import("../view/ProgressQuery.vue")
  },
  {
    path: "/commonquery",
    name: "CommonQuery",
    component: () => import("../view/CommonQuery.vue")
  },
  {
    path: "/recruit/:id",
    name: "RecruitDetail",
    component: () => import("../view/RecruitDetail.vue")
  },
  {
    path: "/recruit",
    name: "Recruit",
    component: () => import("../view/Recruit.vue")
  },
  {
    path: "/jobs",
    name: "Jobs",
    component: () => import("../view/Jobs.vue")
  },
  {
    path: "/jobs/:id",
    name: "JobDetail",
    component: () => import("../view/JobDetail.vue")
  },
  {
    path: "/resume",
    name: "Resume",
    component: () => import("../view/Resume.vue")
  },
  {
    path: "/resume/edit",
    name: "resumeEditor",
    component: () => import("@/view/ResumeEditor.vue")
  },
  {
    path: "/countrysiderecruit",
    name: "countrysideRecruit",
    component: () => import("@/view/CountrysideRecruit.vue")
  },
  {
    path: "/countrysiderecruit/detail",
    name: "CountrysideJobDetail",
    component: () => import("../view/CountrysideJobDetail.vue")
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return { x: 0, y: 0 };
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;
// 解决跳转到当前路由报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

router.onError(err => {
  if (err.name === "ChunkLoadError") {
    router.app.$notify.error("网络资源加载错误");
  }
});
// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (pathArr.indexOf(to.path) !== -1) {
    let tag = localStorage.getItem("tag"); // 权限判断
    if (to.meta.roles.includes(tag)) {
      next();
    } else {
      next("/user");
    }
  } else {
    next();
  }
});
