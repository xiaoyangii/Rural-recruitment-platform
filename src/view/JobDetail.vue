<template>
  <div class="job-detail">
    <h1 class="job-detail-title">{{ jobDetail.title }}</h1>
    <div class="job-detail-subTitle" v-if="jobDetail.recruitId">
      <span class="city_info">{{ jobDetail.workPlace }}</span
      >&nbsp;| <span class="job_category">{{ jobDetail.profession }}</span
      >&nbsp;|
      <span class="recruit_type">正式</span>
    </div>
    <div class="job-detail-description job-detail-block">
      <h2>职位描述</h2>
      <pre class="textContent">{{ jobDetail.industry }}</pre>
    </div>
    <div class="job-detail-requirement job-detail-block">
      <h2>职位要求</h2>
      <pre class="textContent">{{ jobDetail.detail }}</pre>
    </div>
    <div class="job-detail-button job-detail-block">
      <Bbutton @click="delivery" size="large">投递</Bbutton>
    </div>
  </div>
</template>
<script>
import Bbutton from "@/components/bbutton.vue";
import request from "@/utils/request";
export default {
  name: "Jobdetail",
  data() {
    return { jobDetail: {} };
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
      var formDate = new FormData();
      const loading = this.$loading();
      request
        .post("/RecruitNeeds/selectNeeds", formDate)
        .then(res => {
          if (res.status == 200) {
            loading.close();
            this.$message({
              message: "提交简历成功",
              type: "success"
            });
          } else {
            loading.close();
            this.$message({
              message: "提交简历失败" + res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          loading.close();
          this.$message({
            message: "提交简历失败 " + err,
            type: "error"
          });
        });
    }
  },
  created() {
    let loading = this.$loading({ position: { top: 60 } });
    const { id } = this.$route.params;
    var formDate = new FormData();
    formDate.append("recruitId", id);
    // this.request
    //   .get(`/jobs/${id}`)
    //   .then(res => {
    //     this.jobDetail = res.job_post_detail;
    //     loading.close();
    //   })
    //   .catch(loading.close);
    request
      .post("/RecruitNeeds/selectNeedByRecruitId", formDate)
      .then(res => {
        if (res.status == 200) {
          this.$message({
            message: "获取详细信息成功",
            type: "success"
          });
          this.jobDetail = res.data;
          loading.close();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      })
      .catch(err => {
        this.$message({
          message: "获取详细信息失败 " + err,
          type: "error"
        });
        loading.close();
      });
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
