<template>
  <div class="login-wrap">
    <el-form class="login-container" :model="form" :rules="rules" ref="form">
      <h1 class="title">用户注册：</h1>
      <el-form-item prop="userName">
        <el-input
          type="text"
          placeholder="用户姓名"
          v-model="form.userName"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input
          type="text"
          placeholder="用户账号"
          v-model.number="form.userId"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userPassword">
        <el-input
          type="password"
          placeholder="用户密码"
          v-model="form.userPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userPassword1">
        <el-input
          type="password"
          placeholder="确认密码"
          v-model="form.userPassword1"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userContactInformation">
        <el-input
          type="text"
          placeholder="电话号码"
          v-model.number="form.userContactInformation"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userEmail">
        <el-input
          type="text"
          placeholder="邮箱"
          v-model.number="form.userEmail"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doRegister" style="width: 48%;"
          >注册</el-button
        >
        <el-button type="primary" @click="toLogin" style="width: 48%;"
          >返回登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "Register",
  data() {
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    return {
      form: {
        userId: "",
        userPassword: "",
        userPassword1: "",
        userRight: 0,
        userContactInformation: "",
        userName: "",
        userEmail: ""
      },
      rules: {
        userId: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { type: "number", message: "账号必须为数字值" },
          {
            pattern: /^\d{4,10}$/,
            message: "长度在 4 到 10 个数字",
            trigger: "blur"
          }
        ],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 10,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "长度在 4 到 10 个字符且为数字和字母",
            trigger: "blur"
          }
        ],
        userPassword1: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            min: 4,
            max: 10,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "长度在 4 到 10 个字符且为数字和字母",
            trigger: "blur"
          }
        ],
        userContactInformation: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { type: "number", message: "号码必须为数字值" },
          { pattern: /^\d{11}$/, message: "请输入11个数字", trigger: "blur" }
        ],
        userEmail: [{ required: true, trigger: "blur", validator: checkEmail }]
      }
    };
  },
  methods: {
    async doRegister() {
      if (this.form.userPassword !== this.form.userPassword1) {
        this.$message({
          message: "两次输入的密码不一致",
          type: "error"
        });
        return false;
      }
      let params = {
        userId: this.form.userId,
        userName: this.form.userName,
        userPassword: this.form.userPassword1,
        userContactInformation: this.form.userContactInformation.toString(),
        userRight: this.form.userRight,
        email: this.form.userEmail
      };
      await request
        .post("/user/enroll", params)
        .then(res => {
          if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push("/user");
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "注册失败 " + err,
            type: "error"
          });
        });
    },
    toLogin() {
      this.$router.push("/user");
    }
  }
};
</script>
<style scopde>
.login-container {
  border-radius: 15px;
  margin: 70px auto;
  width: 350px;
  padding: 30px 35px 0px 35px;
  background: #fff;
  border: 1px solid #d3cccc;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}
::v-deep .el-input__inner {
  border-color: #d3cccc;
}
input {
  border-color: #d3cccc !important;
}
input::placeholder {
  color: #77797a !important;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
