<template>
  <div class="job-detail">
    <h1 class="job-detail-title">{{ obj.type }}</h1>
    <div class="job-detail-subTitle" v-if="obj.recruitmentId">
      <span class="city_info el-icon-location">&nbsp;{{ obj.location }}</span
      >&nbsp;|
      <span class="job_category el-icon-info"
        >&nbsp;公司：{{ obj.company }}</span
      >&nbsp;|
      <span class="recruit_type el-icon-star-on">社招</span>&nbsp;|<span
        class="job_surplusNumber el-icon-warning"
        >&nbsp;剩余岗位人数：{{ obj.surplusNumber }}</span
      >&nbsp;|<span class="job_telephone el-icon-mobile-phone"
        >&nbsp;联系电话：{{ obj.phoneNumber }}</span
      >
    </div>
    <div class="job-detail-description job-detail-block">
      <h2>职位描述</h2>
      <pre class="textContent" v-for="(item, index) in obj.details" :key="index"
        >{{ index + 1 }}.{{ item }}</pre
      >
    </div>
    <div class="job-detail-welfare job-detail-block">
      <h2>职位福利</h2>
      <pre class="textContent el-icon-present">&nbsp;{{ obj.foodAndRest }}</pre>
    </div>
    <div class="job-detail-worktime job-detail-block">
      <h2>工作时间</h2>
      <pre class="textContent el-icon-time">&nbsp;{{ obj.workPeriod }}</pre>
    </div>
    <div class="job-detail-startworktime job-detail-block">
      <h3>开始工作日期</h3>
      <pre class="textContent el-icon-date">&nbsp;{{ obj.startDate }}</pre>
    </div>
    <div class="job-detail-workImg job-detail-block" v-if="obj.descriptionUrls">
      <h3>相关图片</h3>
      <img
        rel="noreferrer"
        style="width: 400px; height: 200px"
        v-for="(item, index) in obj.descriptionUrls"
        :key="index"
        :src="`http://${item}`"
      />
    </div>
    <div class="job-detail-button job-detail-block">
      <Bbutton @click="dialogFormVisible = true" size="large">投递</Bbutton>
      <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="validatorRules" ref="form">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="地址"
            :label-width="formLabelWidth"
            prop="address"
          >
            <el-input v-model="form.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
            <el-input v-model.number="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系电话"
            :label-width="formLabelWidth"
            prop="phoneNumber"
          >
            <el-input
              v-model.number="form.phoneNumber"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogFormVisible = false"
            >取 消</el-button
          >
          <el-button type="warning" @click="resetForm('form')">重置</el-button>
          <el-button type="primary" @click="delivery()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Bbutton from "@/components/bbutton.vue";
import request from "@/utils/request";
export default {
  name: "Countrysidejobdetail",
  data() {
    return {
      jobDetail: {},
      obj: {},
      recruimentId: "",
      dialogFormVisible: false,
      form: {
        name: "",
        address: "",
        sex: "",
        phoneNumber: "",
        age: ""
      },
      validatorRules: {
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { type: "number", message: "号码必须为数字" },
          { pattern: /^\d{11}$/, message: "请输入11个数字", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        address: [
          { required: true, message: "请填写联系地址", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" },
          { pattern: /^[1-9]\d*$/, message: "年龄必须大于0", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    delivery() {
      if (!localStorage.getItem("isLogin")) {
        this.$router.push("/user");
      } else {
        this.submitResume();
      }
    },
    async submitResume() {
      request
        .post("http://8.130.44.99:9001/hunting", {
          hunterId: localStorage.getItem("loginId"),
          recruitmentId: this.obj.recruitmentId,
          name: this.form.name,
          age: this.form.age,
          sex: parseInt(this.form.sex),
          address: this.form.address,
          phoneNumber: this.form.phoneNumber
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message({
              message: "提交失败" + res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "提交失败 " + err,
            type: "error"
          });
        });
    }
  },
  created() {
    const loading = this.$loading();
    this.obj = this.$route.query.obj;
    if (!localStorage.getItem("obj")) {
      localStorage.setItem("obj", JSON.stringify(this.obj));
    } else {
      this.obj = JSON.parse(localStorage.getItem("obj"));
    }
    if (this.obj.descriptionUrls == null) {
      this.obj.descriptionUrls = 0;
    } else {
      for (var i = 0; i < this.obj.descriptionUrls.length; i++) {
        this.obj.descriptionUrls[i] = "http://" + this.obj.descriptionUrls[i];
      }
    }
    this.recruimentId = this.obj.recruimentId;
    loading.close();
  },
  mounted() {
    if (!localStorage.getItem("obj")) {
      localStorage.setItem("obj", JSON.stringify(this.obj));
    } else {
      this.obj = JSON.parse(localStorage.getItem("obj"));
    }
    this.recruimentId = this.obj.recruimentId;
  },
  destroyed() {
    localStorage.removeItem("obj");
  },
  components: {
    Bbutton
  }
};
</script>
<style lang="less" scoped>
.job-detail {
  width: 800px;
  margin: auto;
  margin-top: 80px;
  border: 5px solid @border-lighter-color;
  padding: 20px;
  border-radius: 15px;
  line-height: 2em;
  &-subTitle {
    font-size: @font-size-base;
    color: @primary-text-color;
    margin: 20px 0;
  }
  &-description {
    .textContent {
      white-space: pre-line;
    }
  }
  &-block {
    h2 {
      margin-bottom: 20px;
    }
    margin: 40px 0;
    .textContent {
      font-size: @font-size-base;
      color: @primary-text-color;
    }
  }
  &-button {
    width: 200px;
  }
}
</style>
