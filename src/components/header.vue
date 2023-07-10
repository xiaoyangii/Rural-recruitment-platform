<template>
  <div class="header" :class="[{ fixedToTop }, themeColor]">
    <h1 class="logo">
      福建乡村招聘平台
    </h1>
    <ul class="navbar">
      <router-link to="/" exact v-slot="{ href, navigate, isActive }">
        <li class="navbar-item" :class="{ active: isActive }">
          <a :href="href" @click="navigate">主页</a>
        </li>
      </router-link>
      <router-link exact to="/recruit" v-slot="{ href, navigate, isActive }">
        <li class="navbar-item" :class="{ active: isActive }">
          <a :href="href" @click="navigate">求职</a>
        </li>
      </router-link>
      <router-link exact to="/jobs" v-slot="{ href, navigate, isActive }">
        <li class="navbar-item" :class="{ active: isActive }">
          <a :href="href" @click="navigate">找工作</a>
        </li>
      </router-link>
      <router-link
        exact
        to="/countrysiderecruit"
        v-slot="{ href, navigate, isActive }"
      >
        <li class="navbar-item" :class="{ active: isActive }">
          <a :href="href" @click="navigate">农村招聘</a>
        </li>
      </router-link>
    </ul>
    |
    <div class="user">
      <div class="login" v-if="!state">
        <router-link to="/user">
          <span class="login__text">登录</span>
        </router-link>
      </div>

      <div class="dropdown-menu" v-else>
        <span class="dropdown-menu__email">
          {{ this.loginId }}
          <i class="arrow"></i>
        </span>
        <ul class="dropdown-menu__wrapper">
          <li class="dropdown-menu__item" @click="handleJumpQuery">
            乡村招聘进度查询
          </li>
          <li class="dropdown-menu__item" @click="handleJumpCommonQuery">
            招聘进度查询
          </li>
          <li class="dropdown-menu__item" @click="handleJumpResume">
            我的简历
          </li>
          <li class="dropdown-menu__item" @click="handleLogout">退出</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      loginId: localStorage.getItem("loginId"),
      state: false
    };
  },
  created() {
    this.reviseState();
  },
  beforeUpdate() {
    this.reviseState();
  },
  props: {
    fixedToTop: {
      type: Boolean,
      default: false
    },
    themeColor: {
      type: String,
      default: "main-color"
    }
  },
  methods: {
    reviseState() {
      if (localStorage.getItem("isLogin")) {
        this.state = true;
      }
    },
    handleLogout() {
      localStorage.removeItem("isLogin");
      // 1. 清空 token
      localStorage.removeItem("satoken");
      localStorage.removeItem("loginId");
      localStorage.removeItem("tag");
      // 2. 跳转到主页面
      this.$router.push("/");
      this.state = false;
    },
    handleJumpResume() {
      this.$router.push("/resume");
    },
    handleJumpQuery() {
      this.$router.push("/progressquery");
    },
    handleJumpCommonQuery() {
      this.$router.push("/commonquery");
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  color: #aaa;

  display: flex;
  height: 60px;
  align-items: center;
  padding: 10px 100px;
  min-width: 900px;
  &.fixedToTop {
    position: fixed;

    width: 100%;
  }
  &.main-color {
    background-color: rgba(255, 255, 255, 0.8);
    .navbar-item {
      &:hover {
        color: @main-color;
      }
    }
    .login-text {
      color: @main-color;
    }
  }
  &.is-transparent {
    color: #fff;
    .navbar-item {
      &:hover {
        color: #ccc;
      }
    }
    .active {
      color: #fff;
    }
  }
}

.logo {
  width: 300px;
  height: 100%;
}
.navbar {
  margin-left: auto;
  margin-right: 20px;

  display: flex;
  &-item {
    padding: 4px 0px;
    margin: 0 20px;
    &.active {
      border-bottom: 2px solid;
      color: @main-color;
    }
  }
}
.user {
  margin-left: 40px;
  position: relative;

  .arrow {
    display: inline-block;
    border: 1px solid;
    border-width: 1px 1px 0 0;
    transform: rotate(135deg);
    transform-origin: center;
    vertical-align: 5px;
    margin-left: 5px;
    transition: all 0.3s;
    width: 10px;
    height: 10px;
  }
  &:hover {
    .arrow {
      transform: rotate(-45deg);
      vertical-align: -3px;
    }
    .dropdown-menu__wrapper {
      display: block;
    }
  }
  .dropdown-menu {
    position: relative;
    z-index: 1000;
    &__email {
      line-height: 2;
      cursor: pointer;
    }
    &__wrapper {
      position: absolute;
      display: none;
      right: 0;
      color: @regular-text-color;
      padding: 9px 0;
      width: 200px;
      border-radius: 5px;
      box-shadow: 0 0px 2px 1px #eee;
      background: #fff;
    }
    &__item {
      padding: 9px 12px;
      cursor: pointer;
      &:hover {
        background: #efefef58;
      }
    }
  }
}
</style>
