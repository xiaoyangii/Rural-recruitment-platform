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
        placeholder="搜索求职信息"
        v-model="searchKeyword"
      ></Inputsearch>
    </div>

    <div class="main clearfix">
      <!-- 侧边栏过滤选择 -->
      <div class="clearfix aside-filter">
        <div class="header">
          <span>选择</span>
          <span :class="{ clearable }" class="clear" @click="clearFilter"
            >清空</span
          >
        </div>
        <div class="job-category job-filter-block">
          <div class="title"></div>
          <Checkboxtransfer
            title="职位"
            ref="jobCategory"
            v-model="job_category_id_list"
            :props="{ key: 'id', label: 'name' }"
            :data="jobCategories"
          ></Checkboxtransfer>
        </div>
        <div class="job-city job-filter-block">
          <div class="title"></div>
          <Checkboxtransfer
            title="城市"
            ref="location"
            v-model="location_code_list"
            :props="{ key: 'code', label: 'name' }"
            :data="jobCities"
          ></Checkboxtransfer>
        </div>
        <el-form
          :model="salaryForm"
          ref="salaryForm"
          label-width="100px"
          class="salaryForm job-filter-block"
        >
          <el-form-item
            label="薪水"
            prop="inputSalary"
            :rules="[
              { required: true, message: '预期薪水不能为空' },
              {
                pattern: /^[1-9]\d*$/,
                type: 'number',
                message: '预期薪水必须为数字值'
              }
            ]"
          >
            <el-input
              v-model.number="salaryForm.inputSalary"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 主体内容 -->
      <div class="content" v-loading:#ffffff7d.scrollFixed="loading">
        <h2 class="content-title">
          <BButton @click="openRecruitFrom()" size="large" class="Bbutton"
            >发布求职</BButton
          >寻找新的员工 ({{ results.count }})
        </h2>
        <ul class="content-list">
          <li
            class="content-item"
            v-for="item in results.job_post_list"
            :key="item.recruitId"
          >
            <router-link :to="`/recruit/${item.jobId}`">
              <h3 class="title">{{ item.title }}</h3>
              <div class="subTitle">
                <span class="city">{{ item.workPlace }}</span
                >&nbsp;| <span class="job_category">{{ item.profession }}</span
                >&nbsp;| <span class="recruitment_channel">社招</span>&nbsp;|
                <span>{{ item.salary }}</span>
              </div>
              <p class="desc">{{ item.detail }}</p>
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
          <el-form :model="jobForm" status-icon :rules="rules" ref="jobForm">
            <el-form-item
              label="基本信息"
              :label-width="formTotalLabelWidth"
              class="basicImformation"
              style="width: 80px !important;"
            >
              <i class="el-icon-edit"></i>
            </el-form-item>
            <el-form-item
              label="工作名称："
              :label-width="formLabelWidth"
              prop="title"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="jobForm.title"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作职业："
              :label-width="formLabelWidth"
              prop="profession"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="jobForm.profession"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作地址："
              :label-width="formLabelWidth"
              prop="workPlace"
            >
              <el-col :span="20">
                <el-input
                  v-model.trim="jobForm.workPlace"
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
              label="薪资："
              :label-width="formLabelWidth"
              prop="salary"
            >
              <el-col :span="6">
                <el-input
                  v-model.number="jobForm.salary"
                  autocomplete="off"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="工作内容描述："
              :label-width="formLabelWidth"
              prop="detail"
            >
              <el-input
                type="textarea"
                :rows="6"
                v-model.trim="jobForm.detail"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('jobForm')" id="clickId" type="danger"
              >重置</el-button
            >
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="success" @click="submitForm('jobForm')"
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
import Checkboxtransfer from "@/components/checkboxtransfer.vue";
import Inputsearch from "@/components/inputsearch.vue";
import Pagination from "@/components/pagination.vue";
import BButton from "@/components/bbutton.vue";
import request from "@/utils/request";
let positionY = 0;
let searchBarClientHeight = 0;

export default {
  name: "Recruit",
  data() {
    const { keyword, job_category_id } = this.$route.params;
    return {
      searchKeyword: keyword || "",
      currentPage: 1,
      job_category_id_list: job_category_id ? [job_category_id] : [],
      jobCategories: [
        { name: "1", id: "工人" },
        { name: "2", id: "教师" },
        { name: "3", id: "厨师" },
        { name: "4", id: "医生" },
        { name: "5", id: "店员" },
        { name: "6", id: "导游" },
        { name: "7", id: "护士" },
        { name: "8", id: "司机" },
        { name: "9", id: "模特" },
        { name: "10", id: "保安" },
        { name: "11", id: "会计" },
        { name: "12", id: "律师" },
        { name: "13", id: "裁缝" },
        { name: "14", id: "清洁工" },
        { name: "15", id: "建筑师" },
        { name: "16", id: "理发师" },
        { name: "17", id: "设计师" },
        { name: "18", id: "记者" },
        { name: "19", id: "翻译家" },
        { name: "20", id: "程序员" },
        { name: "21", id: "消防员" },
        { name: "22", id: "快递员" },
        { name: "23", id: "外卖员" },
        { name: "24", id: "推销员" },
        { name: "25", id: "机修工" },
        { name: "26", id: "零时工" },
        { name: "27", id: "救生员" },
        { name: "28", id: "主持人" },
        { name: "29", id: "园艺师" },
        { name: "30", id: "化妆师" },
        { name: "31", id: "演员" }
      ],
      jobCities: [
        { name: "fj_1", code: "福州" },
        { name: "fj_2", code: "厦门" },
        { name: "fj_3", code: "漳州" },
        { name: "fj_4", code: "泉州" },
        { name: "fj_5", code: "莆田" },
        { name: "fj_6", code: "三明" },
        { name: "fj_7", code: "南平" },
        { name: "fj_8", code: "龙岩" },
        { name: "fj_9", code: "宁德" },
        { name: "bj_1", code: "北京" },
        { name: "shangh_1", code: "上海" },
        { name: "gd_1", code: "广州" },
        { name: "gd_2", code: "深圳" },
        { name: "gd_3", code: "珠海" },
        { name: "zj_1", code: "杭州" },
        { name: "cq_1", code: "重庆" },
        { name: "hun_1", code: "长沙" },
        { name: "ah_1", code: "合肥" },
        { name: "jx_1", code: "南昌" },
        { name: "js_1", code: "南京" },
        { name: "js_2", code: "苏州" },
        { name: "hb_1", code: "武汉" },
        { name: "hen_1", code: "郑州" },
        { name: "sd_1", code: "青岛" },
        { name: "jl_1", code: "长春" },
        { name: "hlj_1", code: "哈尔滨" },
        { name: "gx_1", code: "南宁" },
        { name: "yn_1", code: "昆明" },
        { name: "sc_1", code: "成都" },
        { name: "ln_1", code: "沈阳" },
        { name: "ln_2", code: "大连" }
      ],
      location_code_list: [],
      cityList: [],
      cities: [],
      results: [],
      salaryForm: {
        inputSalary: 0
      },
      searchBarFixedTop: false,
      loading: false,
      dialogFormVisible: false,
      jobForm: {
        workPlace: "",
        salary: "",
        profession: "",
        title: "",
        detail: ""
      },
      rules: {
        title: [{ required: true, trigger: "blur", message: "请输入工作名称" }],
        profession: [
          { required: true, trigger: "blur", message: "请输入工作职业" }
        ],
        workPlace: [
          { required: true, trigger: "blur", message: "请输入工作地址" }
        ],
        salary: [
          {
            required: true,
            trigger: "blur",
            message: "请输入薪水（元/月）"
          }
        ],
        detail: [{ required: true, trigger: "blur", message: "请输入工作描述" }]
      },
      formLabelWidth: "150px",
      formTotalLabelWidth: "70px",
      formDate: new FormData()
    };
  },

  created() {
    this.fetchBeginList();
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
      var formDate = new Object();
      formDate = {
        profession: this.job_category_id_list,
        workPlace: this.location_code_list,
        salary: this.salaryForm.inputSalary
      };
      return formDate;
      // keyword: this.searchKeyword,
      // offset: Math.max(0, this.currentPage - 1) * 10
    },
    clearable() {
      return (
        this.job_category_id_list.length !== 0 ||
        this.location_code_list.length !== 0 ||
        this.salaryForm.inputSalary !== 0
      );
    }
  },
  watch: {
    queryFilter: function() {
      this.searchBarFixedTop && window.scrollTo(0, positionY);
      this.fetchList();
    }
  },
  methods: {
    clearFilter() {
      if (this.job_category_id_list.length) {
        this.job_category_id_list = [];
      }
      if (this.location_code_list.length) {
        this.location_code_list = [];
      }
      this.salaryForm.inputSalary = 0;
    },
    async fetchBeginList() {
      var formDate = new FormData();
      formDate.append("profession", this.job_category_id_list);
      formDate.append("workPlace", this.location_code_list);
      formDate.append("salary", 0);
      this.results = [];
      const loading = this.$loading();
      await request
        .post("/JobHunting/selectJobHunting", formDate)
        .then(res => {
          if (res.status == 200) {
            loading.close();
            this.$message({
              message: "获取列表成功",
              type: "success"
            });
            var resultObj = {
              job_post_list: res.data,
              count: res.data.length
            };
            this.results = resultObj;
          } else {
            loading.close();
            this.$message({
              message: res.data.msg,
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
    async fetchList() {
      var formDate = new FormData();
      formDate.append("profession", this.queryFilter.profession);
      formDate.append("workPlace", this.queryFilter.workPlace);
      formDate.append("salary", this.queryFilter.salary);
      this.results = [];
      await request
        .post("/JobHunting/selectJobHunting", formDate)
        .then(res => {
          var resultObj = {
            job_post_list: res.data,
            count: res.data.length
          };
          this.results = resultObj;
          if (res.status == 200) {
            this.$message({
              message: "查询成功",
              type: "success"
            });
            console.log(res.data);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "查询失败 " + err,
            type: "error"
          });
        });
    },
    openRecruitFrom() {
      this.dialogFormVisible = true;
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.formDate.append("title", this.jobForm.title);
          this.formDate.append("workPlace", this.jobForm.workPlace);
          this.formDate.append("salary", this.jobForm.salary);
          this.formDate.append("isPass", 0);
          this.formDate.append("JobId", "");
          this.formDate.append("details", this.jobForm.detail);
          this.formDate.append("userId", localStorage.getItem("loginId"));
          this.formDate.append("profession", this.jobForm.profession);
          const loading = this.$loading();
          this.$axios({
            url: "http://recruimentweb.vipgz4.91tunnel.com/JobHunting/addJobHunting",
            method: "post",
            data: this.formDate
          })
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                loading.close();
                this.$message({
                  message: "发布成功",
                  type: "success"
                });
                this.resetForm("jobForm");
                this.fetchBeginList();
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
    }
  },
  components: {
    Inputsearch,
    Checkboxtransfer,
    Pagination,
    BButton
  }
};
</script>
<style lang="less" scoped>
.banner {
  height: 600px;
  line-height: 600px;
  color: #a4beee;
  width: 100%;
  min-width: @main-width;
  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0) 80%
    ),
    url("../assets/image/laptop.jpg");
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
  margin-top: 100px;
  padding: 0 100px 0 200px;
  background-image: linear-gradient(to right, #a4beee, #fff);
  border-radius: 15px;
  .aside-filter {
    float: left;
    width: 350px;
    padding-right: 20px;
    margin-top: 20px;
    padding-right: 100px;
    .header {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      border-bottom: 1px solid @border-lighter-color;
      padding-bottom: 10px;
      width: 100%;
      .clear {
        &.clearable {
          color: @main-color;
          cursor: pointer;
        }
      }
    }
    .job-filter-block {
      margin-bottom: 40px;
    }
  }

  .content {
    min-height: 500px;
    padding-left: 20px;
    border-left: 3px solid @border-lighter-color;
    margin-left: 300px;
    margin-top: 20px;
    &-title {
      margin-bottom: 30px;
      margin-left: 20px;
      line-height: 50px;
    }

    &-item {
      margin-bottom: 10px;
      padding: 10px 20px;
      cursor: pointer;
      border: 3px solid @border-lighter-color;
      border-radius: 10px;
      .title {
        margin: 12px 0;
      }
      .subTitle {
        color: @regular-text-color;
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
      background-color: #3033da;
      font-size: 18px;
    }
    ::v-deep .el-form-item__label {
      padding-right: 0 !important;
    }
  }
}
</style>
<style scoped>
::v-deep .el-form-item__label {
  font-size: 16px;
}
::v-deep .el-input {
  font-size: 18px;
}
::v-deep .Bbutton {
  width: 80px;
  float: left;
  margin-right: 20px;
  background-color: #3033da;
  font-size: 18px;
}
::v-deep .content-title {
  line-height: 50px;
}
</style>
