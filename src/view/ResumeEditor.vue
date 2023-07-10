<template>
  <div>
    <div id="progress"></div>
    <div class="resume-editor" ref="editorFrom">
      <h1>编辑简历</h1>
      <div>
        <!-- 基础信息 -->
        <div class="resumeSection">
          <div>
            <h2 class="resumeSection__title">基础信息</h2>
          </div>
          <div class="resumeSection__form">
            <el-form
              :model="{
                name: resume.name,
                email: resume.email,
                mobile_number: resume.mobile_number
              }"
              :rules="validatorRules.basic"
              ref="basicForm"
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="resume.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile_number">
                <el-input v-model="resume.mobile_number"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="resume.email"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 工作经历 -->
        <div class="resumeSection">
          <div>
            <h2 class="resumeSection__title">工作经历</h2>
          </div>
          <div class="resumeSection__form">
            <el-checkbox v-model="withoutCareer">我没有工作经历</el-checkbox>
            <template v-for="(career, key) in resume.career_list">
              <el-form
                ref="careerForm"
                :model="career"
                :rules="validatorRules.career"
                :key="key"
                v-if="!withoutCareer"
                label-position="top"
              >
                <el-form-item prop="company" label="公司">
                  <el-input
                    ref="companyInput"
                    v-model="career.company"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="title" label="职位">
                  <el-input ref="titleInput" v-model="career.title"></el-input>
                </el-form-item>
                <el-form-item label="起止时间" prop="daterange">
                  <el-date-picker
                    clearable
                    value-format="timestamp"
                    v-model="career.daterange"
                    type="monthrange"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input
                    type="textarea"
                    :rows="5"
                    v-model="career.description"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="bottom-action">
                    <i
                      class="el-icon-plus"
                      v-if="key === resume.career_list.length - 1"
                      @click="
                        resume.career_list.push({
                          company: '',
                          description: '',
                          position: '',
                          start_time: 0,
                          end_time: 0,
                          daterange: []
                        })
                      "
                      >添加</i
                    >
                    <i
                      @click="resume.career_list.splice(key, 1)"
                      class="el-icon-delete"
                      v-if="resume.career_list.length > 1"
                    ></i>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </div>
        <!-- 教育经历 -->
        <div class="resumeSection">
          <div>
            <h2 class="resumeSection__title">教育经历</h2>
          </div>
          <div class="resumeSection__form">
            <template v-for="(item, key) in resume.education_list">
              <el-form
                :model="item"
                ref="educationForm"
                :rules="validatorRules.education"
                :key="key"
                label-position="top"
              >
                <el-form-item label="学校" prop="school">
                  <el-input v-model="item.school"></el-input>
                </el-form-item>
                <el-form-item label="学历" prop="degree">
                  <el-select v-model="item.degree">
                    <el-option
                      v-for="item in setting.degree"
                      :label="item.val"
                      :value="item.val"
                      :key="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="专业">
                  <el-input v-model="item.major"></el-input>
                </el-form-item>
                <el-form-item label="起止时间" prop="daterange">
                  <el-date-picker
                    value-format="timestamp"
                    v-model="item.daterange"
                    type="monthrange"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <div class="bottom-action">
                    <i
                      class="el-icon-plus"
                      v-if="key === resume.education_list.length - 1"
                      @click="
                        resume.education_list.push({
                          school: '',
                          major: '',
                          education_type: '',
                          start_time: 0,
                          end_time: 0,
                          degree: -1,
                          daterange: []
                        })
                      "
                      >添加</i
                    >
                    <i
                      @click="resume.education_list.splice(key, 1)"
                      class="el-icon-delete"
                      v-if="key > 0"
                    ></i>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </div>
        <!-- 获奖 -->
        <div class="resumeSection">
          <div>
            <h2 class="resumeSection__title">获奖</h2>
          </div>
          <div class="resumeSection__form">
            <div
              class="bottom-action"
              v-if="resume.award_list && resume.award_list.length === 0"
            >
              <i
                class="el-icon-plus el-icon-plus-top"
                @click="
                  resume.award_list.push({
                    description: '',
                    link: ''
                  })
                "
                >添加</i
              >
            </div>
            <template v-for="(item, key) in resume.award_list">
              <el-form
                :model="item"
                :key="key"
                ref="awardForm"
                label-position="top"
                :rules="validatorRules.award"
              >
                <el-form-item prop="title" label="名称">
                  <el-input v-model="item.title"></el-input>
                </el-form-item>
                <el-form-item label="获奖时间">
                  <el-date-picker
                    style="width:100%"
                    type="month"
                    v-model="item.award_time"
                    value-format="timestamp"
                    placeholder="获奖时间"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="描述">
                  <el-input
                    v-model="item.desc"
                    :rows="5"
                    type="textarea"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="bottom-action">
                    <i
                      class="el-icon-plus"
                      v-if="key === resume.award_list.length - 1"
                      @click="
                        resume.award_list.push({
                          description: '',
                          link: ''
                        })
                      "
                      >添加</i
                    >
                    <i
                      @click="resume.award_list.splice(key, 1)"
                      class="el-icon-delete"
                    ></i>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="footerAction"
      :class="{ 'resumeEditor-footerAction-fix': footerActionFixed }"
      class="resumeEditor-footerAction"
    >
      <el-button round @click="$router.push('/resume')">取消</el-button>
      <el-button
        round
        :loading="submitLoading"
        size="medium"
        @click="submit"
        type="primary"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { getOffsetTop } from "@/helper/utilities";
import request from "@/utils/request.js";
export default {
  name: "resumeEditor",
  data() {
    return {
      submitLoading: false,
      uploadData: {},
      resume: {
        career_list: [
          {
            company: "",
            start_time: "",
            end_time: "",
            title: "",
            description: ""
          }
        ],
        education_list: [
          {
            school: "",
            major: "",
            education_type: "",
            start_time: 0,
            end_time: 0,
            degree: "",
            daterange: []
          }
        ],
        award_list: [
          {
            title: "",
            award_time: "",
            desc: ""
          }
        ]
      },
      setting: {
        degree: [
          { key: 8, val: "博士" },
          { key: 7, val: "硕士" },
          { key: 6, val: "本科" },
          { key: 5, val: "大专" },
          { key: 4, val: "高中" },
          { key: 3, val: "专职" },
          { key: 2, val: "初中" },
          { key: 1, val: "小学" },
          { key: 9, val: "其他" }
        ]
      },
      withoutCareer: false,
      footerActionFixed: false,
      careerList: [],
      validatorRules: {
        basic: {
          name: { required: true, trigger: "blur", message: "请输入姓名" },
          mobile_number: [
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
          email: [
            { required: true, trigger: "blur", message: "请输入邮箱" },
            { type: "email", trigger: "blur", message: "请输入合法的邮箱" }
          ]
        },
        award: {
          title: {
            required: true,
            trigger: "blur",
            message: "请输入获奖名称"
          }
        },
        career: {
          company: [{ required: true, trigger: "blur", message: "请输入公司" }],
          title: { required: true, trigger: "blur", message: "请输入职位" },
          daterange: [
            { required: true, trigger: "blur", message: "请输入日期" }
          ]
        },
        internship: {
          company: [{ required: true, trigger: "blur", message: "请输入公司" }],
          position: {
            required: true,
            trigger: "blur",
            message: "请输入职位"
          },
          daterange: [
            { required: true, trigger: "blur", message: "请输入日期" }
          ]
        },
        education: {
          school: {
            required: true,
            trigger: "blur",
            message: "请输入学校名称"
          },
          degree: {
            required: true,
            trigger: "blur",
            message: "请选择学历"
          },
          daterange: {
            required: true,
            trigger: "blur",
            message: "请选择起止时间"
          }
        }
      }
    };
  },
  computed: {},

  created() {
    // const loading = this.$loading({ position: { top: 60 } });
    // const fetchResumeRequest = fetchResume()
    //   .then(response => {
    //     this.uploadData = this.resume.resume_attachment || {};
    //     this.withoutCareer = this.resume.career_list.length === 0;
    //     this.$nextTick(() => {
    //       // 初始化后判断页面滚动的位置，设置底部操作栏定位位置
    //       const footerActionNode = this.$refs["footerAction"];
    //       this.footerActionShouldFixedThreshold =
    //         getOffsetTop(document.body, footerActionNode) +
    //         footerActionNode.offsetHeight;
    //       this.onPageScroll();
    //     });
    //     // 观测一次是否有工作经历，初始化表单数据
    //     const unwatch = this.$watch("withoutCareer", newVal => {
    //       if (
    //         this.resume.career_list &&
    //         this.resume.career_list.length === 0 &&
    //         !newVal
    //       ) {
    //         this.resume.career_list.push({});
    //       }
    //       unwatch();
    //     });
    //   })
    //   .catch(err => {
    //     return Promise.reject(err);
    //   });
    // const fetchCommonSettingsRequest = fetchCommonSettings()
    //   .then(response => {
    //     this.setting = response.data;
    //   })
    //   .catch(err => {
    //     return Promise.reject(err);
    //   });
    // Promise.all([fetchCommonSettingsRequest, fetchResumeRequest])
    //   .then(() => {
    //     loading.close();
    //   })
    //   .catch(err => {
    //     loading.close();
    //   });
  },
  mounted() {
    window.addEventListener("scroll", this.onPageScroll);
    window.addEventListener("beforeunload", this.onbeforeunloadAlert);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onPageScroll);
    window.removeEventListener("beforeunload", this.onbeforeunloadAlert);
  },
  methods: {
    onPageScroll() {
      this.footerActionFixed =
        window.scrollY <
        this.footerActionShouldFixedThreshold - window.innerHeight;
    },
    async submit() {
      var formDate = new FormData();
      formDate.append("userId", parseInt(localStorage.getItem("loginId")));
      formDate.append("employersId", "");
      formDate.append("isPass", 0);
      formDate.append("resumeId", "");

      formDate.append("careerStartTime", this.format(this.resume.career_list[0].daterange[0]));
      formDate.append("careerEndTime", this.format(this.resume.career_list[0].daterange[1]));
      formDate.append("careerDescription", this.resume.career_list[0].description);
      formDate.append("careerProfession", this.resume.career_list[0].title);

      formDate.append("educationSchool", this.resume.education_list[0].school);
      formDate.append("educationStartTime", this.format(this.resume.education_list[0].daterange[0]));
      formDate.append("educationEndTime", this.format(this.resume.education_list[0].daterange[1]));
      formDate.append("educationMajor", this.resume.education_list[0].major);
      formDate.append("educationDescription", this.resume.education_list[0].degree);

      formDate.append("awardTitle", this.resume.award_list[0].title);
      formDate.append("awardTime", this.format(this.resume.education_list[0].award_time));
      formDate.append("awardDescription", this.resume.education_list[0].desc);

      await request
        .post("http://recruimentweb.vipgz4.91tunnel.com/Resume/addResume", formDate)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "简历保存成功",
              type: "success"
            });
            this.$router.push("/resume");
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取列表失败 " + err,
            type: "error"
          });
        });
    },
    onbeforeunloadAlert(e) {
      e.preventDefault();
      e.returnValue = false;
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + this.add0(m) + "-" + this.add0(d) + " "+ this.add0(h) + ":" + add0(mm) + ":" + add0(s);
    }
  }
};
</script>
<style lang="less">
.el-upload {
  width: 100%;
  .uploadFile__works {
    .uploadWorks__fileicon {
      width: 50px;
      height: 50px;
      margin: auto;
    }
    .el-icon-warning {
      font-size: 30px;
    }
  }
  &:focus {
    border-color: inherit;
    color: inherit;
  }
  &-dragger {
    display: table-cell;
    vertical-align: middle;

    border: none;
    background: @bg-base-color;
    width: 600px;
    .upload-button {
      display: inline-block;
      width: 100px;
      margin: 10px 0;
    }

    .afterUpload {
      .fileicon {
        width: 50px;
        height: 50px;
        margin: auto;
      }
      time {
        color: @secondary-text-color;
      }
      &__actionButton {
        color: @main-color;
        &-dividerLine {
          margin: 0 14px;
        }
      }
    }
  }
}
.upload-success-tip {
  display: flex;
  background: @bg-base-color;
  padding: 0 7px;
  align-items: center;
  .el-icon-warning {
    color: @main-color;
  }
  .tips-resolve {
    color: @main-color;
    cursor: pointer;
    margin-left: 6px;
  }
  .el-icon-close {
    cursor: pointer;
    margin-left: auto;
  }
}
// }
.resumeSection {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .bottom-action {
    display: flex;

    .el-icon-plus,
    .el-icon-delete {
      font-size: 22px;
      cursor: pointer;
      &-top {
        margin-left: auto;
      }
    }

    .el-icon-delete {
      margin-left: auto;
    }
  }
  .el-form {
    margin-bottom: 40px;
    &:not(:last-child) {
      border-bottom: 1px solid @border-light-color;
    }
  }
}
</style>

<style lang="less" scoped>
.resume-editor {
  width: 900px;
  margin: auto;
  padding: 30px 0;
}
.resumeEditor-footerAction {
  padding: 30px 190px;
  z-index: 33;
  text-align: right;
  &-fix {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;

    box-shadow: 0 -2px 10px #eee;
  }
}
.resumeSection {
  padding: 50px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid @border-base-color;

  &__title {
    margin-right: 200px;

    padding-bottom: 3px;
    border-bottom: 2px solid @main-color;
  }
  &__form {
    width: 600px;
  }
}
</style>
