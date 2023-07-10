<template>
  <div class="user">
    <el-form class="login-container">
      <h1 class="title">用户登录：</h1>
      <el-form-item>
        <el-input
          type="text"
          placeholder="用户账号"
          v-model="userId"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          placeholder="用户密码"
          v-model="userPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doLogin" style="width: 100%;"
          >登录</el-button
        >
      </el-form-item>
      <el-row style="text-align: center;margin-top: -10px;">
        <el-link type="primary" @click="toRegister"
          >用户注册&nbsp;&nbsp;
        </el-link>
        <el-link type="primary"> 忘记密码</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";
import request from "@/utils/request.js";
export default {
  name: "user",
  data: function() {
    return {
      userId: "",
      userPassword: ""
    };
  },
  methods: {
    async doLogin() {
      let userId = this.userId;
      let userPassword = this.userPassword;
      let params = {
        userId: userId,
        userPassword: userPassword
      };
      let str = qs.stringify(params);
      await request
        .post("/user/login", str)
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            localStorage.setItem("tag", res.data.data.tag.toString());
            localStorage.setItem("satoken", res.data.data.tokenValue);
            localStorage.setItem("loginId", res.data.data.loginId);
            localStorage.setItem("isLogin", true);
            this.$message({
              message: "登陆成功",
              type: "success"
            });
            if (res.data.data.tag === "0") {
              this.$router.push({
                path: "/"
              });
            } else {
              this.$router.push("/admin");
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "登陆失败 " + err,
            type: "error"
          });
        });
    },
    toRegister() {
      this.$router.push("/register");
    }
  }
};
</script>
<style scoped lang="less">
.login-container {
  border-radius: 15px;
  margin: 87px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #d3cccc;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
::v-deep .el-input__inner {
  border-color: #d3cccc;
}
::v-deep .el-input__inner::placeholder {
  color: #77797a;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.el-link--inner {
  margin-right: 10px;
}
.el-link.is-underline:hover:after {
  border-bottom: none;
}
</style>
