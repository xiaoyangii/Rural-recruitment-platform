<template>
  <div class="jobs">
    <div class="banner">用双手，去创造财富</div>

    <!-- 搜索 -->
    <div
      ref="searchBar"
      :class="{ fixedTop: searchBarFixedTop }"
      class="search-wrapper"
    >
      <Inputsearch
        :size="searchBarFixedTop ? 'small' : 'medium'"
        placeholder="搜索职位"
        v-model="searchKeyword"
      ></Inputsearch>
    </div>

    <div class="main clearfix">
      <!-- 主体内容 -->
      <div class="content" v-loading:#ffffff7d.scrollFixed="loading">
        <h2 class="content-title">
          <BButton @click="openRecruitFrom()" size="large" class="Bbutton"
            >发布招聘</BButton
          >开启新的职位 ({{ results.count }})
        </h2>
        <!-- 招工列表 -->
        <ul class="content-list">
          <li
            class="content-item"
            v-for="item in results.job_post_list"
            :key="item.recruitmentId"
          >
            <router-link
              :to="{
                path: '/CountrysideRecruit/detail',
                query: { obj: item }
              }"
            >
              <h3 class="title">
                <h3 class="company">{{ item.company }}</h3>
                <img
                  class="logoImg"
                  v-if="item.logoUrl"
                  :src="imgUrl(item.logoUrl)"
                  referrerpolicy="no-referrer"
                />{{ item.type }}
              </h3>
              <div class="subTitle">
                <span class="city">{{ item.location }}</span
                >&nbsp;| <span class="recruitment_channel">社招</span>&nbsp;|
                <span class="salary">薪水：{{ item.salary }}</span
                >&nbsp;|
                <span class="peopleNumber"
                  >剩余职位数：{{ item.surplusNumber }} &nbsp; 共：{{
                    item.totalNumber
                  }}</span
                >
              </div>
              <p class="desc" v-for="(ite, index) in item.details" :key="index">
                {{ ite }}
              </p>
            </router-link>
          </li>
        </ul>
        <!-- 分页器 -->
        <div v-show="!loading" class="pagination-wrapper">
          <Pagination
            :current-page.sync="currentPage"
            :total="results.count"
          ></Pagination>
        </div>
        <el-dialog
          title="招工信息填写"
          :visible.sync="dialogFormVisible"
          width="800px"
        >
          <el-form
            :model="recruitForm"
            status-icon
            :rules="rules"
            ref="recruitForm"
          >
            <el-form-item
              label="基本信息"
              :label-width="formTotalLabelWidth"
              class="basicImformation"
            >
              <i class="el-icon-edit"></i>
            </el-form-item>
            <el-form-item
              label="工作名称："
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="recruitForm.type"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作地址："
              :label-width="formLabelWidth"
              prop="location"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="recruitForm.location"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="公司名称："
              :label-width="formLabelWidth"
              prop="company"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="recruitForm.company"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="公司logo：" :label-width="formLabelWidth">
              <el-input v-model="recruitForm.imageUrl" v-if="false"></el-input>
              <el-upload
                class="avatar-uploader"
                ref="upload"
                action=""
                multiple
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-change="handleChange"
                :auto-upload="false"
                :http-request="httpRequest"
                :limit="1"
                :file-list="recruitForm.logo"
              >
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png/jpeg文件，且不超过1MB
                </div>
                <img
                  v-if="recruitForm.imageUrl"
                  :src="recruitForm.imageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="咨询电话："
              :label-width="formLabelWidth"
              prop="phoneNumber"
            >
              <el-col :span="12">
                <el-input
                  v-model.trim="recruitForm.phoneNumber"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作信息"
              :label-width="formTotalLabelWidth"
              class="basicImformation"
            >
              <i class="el-icon-edit"></i>
            </el-form-item>
            <el-form-item
              label="开始工作时间："
              :label-width="formLabelWidth"
              prop="startDate"
            >
              <el-col :span="12">
                <el-date-picker
                  type="datetime"
                  placeholder="选择日期"
                  v-model="recruitForm.startDate"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作时间段："
              :label-width="formLabelWidth"
              prop="workPeriod"
            >
              <el-col :span="12">
                <el-input
                  v-model.trim="recruitForm.workPeriod"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="薪资："
              :label-width="formLabelWidth"
              prop="salary"
            >
              <el-col :span="6">
                <el-input
                  v-model.trim="recruitForm.salary"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作待遇："
              :label-width="formLabelWidth"
              prop="foodAndRest"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="recruitForm.foodAndRest"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="总职位数："
              :label-width="formLabelWidth"
              prop="totalNumber"
            >
              <el-col :span="6">
                <el-input
                  v-model.number="recruitForm.totalNumber"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作内容描述："
              :label-width="formLabelWidth"
              prop="details"
            >
              <el-input
                type="textarea"
                :rows="6"
                v-model.trim="recruitForm.details"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="图片描述：" :label-width="formLabelWidth">
              <el-upload
                class="upload-demo"
                action=""
                :before-remove="beforeRemove"
                :auto-upload="false"
                ref="uploads"
                multiple
                :http-request="httpRequests"
                :limit="3"
                :on-exceed="handleExceed"
                list-type="picture"
                :file-list="recruitForm.descriptions"
              >
                <el-button size="small" type="primary" class="pictureButton"
                  >点击上传图片</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png/jpeg文件，且不超过2MB
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              @click="resetForm('recruitForm')"
              id="clickId"
              type="danger"
              >重置</el-button
            >
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="success" @click="submitForm('recruitForm')"
              >发 布</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getOffsetTop } from "@/helper/utilities";
import Inputsearch from "@/components/inputsearch.vue";
import BButton from "@/components/bbutton.vue";
import Pagination from "@/components/pagination.vue";
import request from "@/utils/request";
let positionY = 0;
let searchBarClientHeight = 0;

export default {
  name: "countrysideRecruit",
  data() {
    const { keyword } = this.$route.params;
    return {
      searchKeyword: keyword || "",
      currentPage: 1,
      results: {},
      searchBarFixedTop: false,
      loading: false,
      dialogFormVisible: false,
      recruitForm: {
        imageUrl: "",
        type: "",
        location: "",
        workPeriod: "",
        foodAndRest: "",
        salary: "",
        totalNumber: 0,
        company: "",
        companyId: "",
        details: [],
        phoneNumber: "",
        startDate: "",
        logo: [],
        descriptions: []
      },
      rules: {
        type: [{ required: true, trigger: "blur", message: "请输入工作名称" }],
        phoneNumber: [
          {
            required: true,
            trigger: "blur",
            message: "请输入手机号"
          },
          {
            validator(rule, value, callback) {
              if (!/^\d{11}$/.test(value)) {
                callback(new Error("请输入合法的手机号"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        company: [{ required: true, trigger: "blur", message: "请输入公司" }],
        location: [
          { required: true, trigger: "blur", message: "请输入工作地址" }
        ],
        workPeriod: [
          { required: true, trigger: "blur", message: "请输入工作时间段" }
        ],
        foodAndRest: [
          { required: true, trigger: "blur", message: "请输入工作待遇" }
        ],
        salary: [
          {
            required: true,
            trigger: "blur",
            message: "请输入薪水（元/月 或 元/年 ...）"
          }
        ],
        totalNumber: [
          { required: true, message: "总职位数不能为空" },
          {
            pattern: /^[1-9]\d*$/,
            type: "number",
            message: "总职位数必须为数字值"
          }
        ],
        startDate: [{ required: true, trigger: "blur", message: "请输入日期" }],
        details: [
          { required: true, trigger: "blur", message: "请输入工作描述" }
        ]
      },
      formLabelWidth: "150px",
      formTotalLabelWidth: "70px",
      formDate: new FormData()
    };
  },

  created() {
    this.fetchList();
  },
  mounted() {
    this.$nextTick(() => {
      positionY = getOffsetTop(document.body, this.$refs.searchBar);
      searchBarClientHeight = this.$refs.searchBar.clientHeight;
    });
    const onPageScroll = () => {
      // eslint-disable-next-line no-unused-vars
      const top = this.$refs.searchBar.getBoundingClientRect().top;
      this.searchBarFixedTop =
        window.scrollY > positionY - searchBarClientHeight / 2;
    };
    window.addEventListener("scroll", onPageScroll);
    this.$on("hook:destroyed", () => {
      window.removeEventListener("scroll", onPageScroll);
    });
  },
  computed: {
    queryFilter() {
      return {
        keyword: this.searchKeyword,
        offset: Math.max(0, this.currentPage - 1) * 10
      };
    }
  },
  watch: {
    queryFilter: function() {
      this.searchBarFixedTop && window.scrollTo(0, positionY);
      this.fetchList();
    }
  },
  methods: {
    async fetchList() {
      const loading = this.$loading();
      this.results = {};
      const url = `http://8.130.44.99:9001/recruitment/${this.currentPage}`;
      await request
        .get(url)
        .then(res => {
          if (res.data.code === 200) {
            loading.close();
            this.$message({
              message: "获取列表成功",
              type: "success"
            });
            this.loading = false;
            var resultObj = {
              job_post_list: res.data.data.recruitments,
              count: res.data.data.totalElements
            };
            this.results = resultObj;
          } else {
            loading.close();
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          loading.close();
          this.$message({
            message: "获取列表失败 " + err,
            type: "error"
          });
        });
    },
    transformString(arr) {
      console.log(arr);
      var len = arr.length;
      var str;
      for (var i = 1; i <= len; i++) {
        str += i + "." + arr[i - 1] + "<br>";
      }
      return str;
    },
    imgUrl(url) {
      return "http://" + url;
    },
    openRecruitFrom() {
      this.dialogFormVisible = true;
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.formDate.append("type", this.recruitForm.type);
          this.formDate.append("location", this.recruitForm.location);
          this.formDate.append("workPeriod", this.recruitForm.workPeriod);
          this.formDate.append("foodAndRest", this.recruitForm.foodAndRest);
          this.formDate.append("salary", this.recruitForm.salary);
          this.formDate.append("startDate", this.recruitForm.startDate);
          this.formDate.append("totalNumber", this.recruitForm.totalNumber);
          this.formDate.append("company", this.recruitForm.company);
          this.formDate.append("phoneNumber", this.recruitForm.phoneNumber);
          this.formDate.append("companyId", localStorage.getItem("loginId"));
          this.formDate.append("details", this.recruitForm.details);
          this.formDate.append("descriptions", this.recruitForm.descriptions);
          // 获取图片
          this.$refs.upload.submit();
          const loading = this.$loading();
          this.$axios({
            url: "http://8.130.44.99:9001/recruitment",
            method: "post",
            data: this.formDate
          })
            .then(res => {
              if (res.status == 200) {
                loading.close();
                this.$message({
                  message: "发布成功",
                  type: "success"
                });
                this.resetForm("recruitForm");
                this.recruitForm.imageUrl = "";
                this.fetchList();
                this.dialogFormVisible = false;
              } else {
                loading.close();
                this.$message({
                  message: "发布失败",
                  type: "error"
                });
              }
            })
            .catch(err => {
              loading.close();
              this.$message({
                message: err.message,
                type: "error"
              });
            });
        } else {
          alert("请填写完整招工信息");
          return false;
        }
      });
    },
    handleChange(file, fileList) {
      console.log(fileList);
      this.recruitForm.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeRemove(file) {
      console.log(file);
      return this.$confirm(`确定移除这张图片吗？`);
    },
    httpRequest(param) {
      //this.$refs.upload.submit()执行后会调用，多个图片会调用多次
      console.log(param);
      this.formDate.append("logo", param.file);
    },
    httpRequests(param) {
      //this.$refs.upload.submit()执行后会调用，多个图片会调用多次
      console.log(param);
      this.formDate.append("descriptions", param.file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制最多选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeUpload(file) {
      console.log(file);
      return true;
    },
    resetForm(form) {
      this.$refs[form].resetFields();
      this.recruitForm.imageUrl = "";
    }
  },
  components: {
    Inputsearch,
    Pagination,
    BButton
  }
};
</script>
<style lang="less" scoped>
.banner {
  height: 700px;
  line-height: 700px;
  color: #fff;
  width: 100%;
  min-width: @main-width;
  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0) 80%
    ),
    url("../assets/image/微信图片_20230502153230.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
  font-size: @font-size-larger;
}
.search-wrapper {
  position: absolute;
  width: 100%;
  padding: 0 200px;
  transform: translateY(-50%);
  z-index: 100;
  &.fixedTop {
    position: fixed;
    box-shadow: 0 5px 4px rgba(0, 0, 0, 0.1);
    top: 0;
    padding: 20px 130px;
    z-index: 1000;
    background-color: #fff;
    transform: translateY(0);
  }
}
.input-search {
  width: 1185px;
  margin: 0;
}
.el-form-item__label {
  vertical-align: left;
}
.main {
  width: @main-width;
  margin: 0 auto;
  margin-top: 60px;
  padding: 0 150px 0 150px;
  .content {
    min-height: 500px;
    padding-left: 20px;
    border-left: 3px solid @border-lighter-color;
    background-image: linear-gradient(to right, #fafad2, #fff);
    border-radius: 15px;
    &-title {
      margin-bottom: 30px;
      padding-top: 20px;
      line-height: 50px;
    }
    &-item {
      margin-bottom: 10px;
      padding: 10px 20px;
      border: 3px solid @border-lighter-color;
      background-color: #fff;
      border-radius: 10px;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
      .title {
        height: 50px;
        line-height: 50px;
        margin: 10px 0;
        .company {
          height: 50px;
          line-height: 50px;
          float: right;
        }
        .logoImg {
          float: right;
          margin-top: 0;
          padding: 0;
          vertical-align: middle;
          height: 45px;
          width: 45px;
          line-height: 45px;
          border-radius: 50%;
        }
      }
      .subTitle {
        color: @regular-text-color;
        .salary {
          color: #dc143c;
        }
        .peopleNumber {
          color: rgb(93, 114, 209);
        }
      }
      .desc {
        white-space: pre-line;
        font-size: 14px;
        color: @secondary-text-color;
        .text-overflow-visible-line(2);
        text-overflow: clip;
      }
      &:hover {
        border-radius: 10px;
        background: rgb(240, 240, 240);
        box-shadow: 0 20px 20px 0 rgba(46, 47, 48, 0.25);
        transition: 0.2s;
      }
    }
    .pagination-wrapper {
      margin-top: 50px;
      text-align: right;
    }
    ::v-deep .Bbutton {
      width: 80px;
      float: left;
      margin-right: 20px;
      background-color: #d4d45f;
      font-size: 18px;
    }
  }
}
::v-deep .input-search-button {
  background-color: #fafad2;
  color: black;
}
::v-deep .input-search {
  border-color: #d4d45f;
}
::v-deep .el-form-item__label {
  padding-right: 0 !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 2px solid @border-lighter-color;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .pictureButton {
  background-color: rgb(165, 194, 38);
  border: rgb(165, 194, 38);
}
</style>
