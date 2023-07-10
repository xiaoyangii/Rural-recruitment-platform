<template>
  <div class="home">
    <div ref="banner" class="banner content-item-block">
      <div class="video-wrapper">
        <video
          ref="video"
          class="video"
          preload="auto"
          muted
          loop
          playsinline
          autoplay
          poster="../assets/image/00c08a401e4afe28cd2281f2e936009.png"
          src="../assets/video/c281a71ba41bc4a30cd02673d7e2e050.mp4"
          tabindex="-1"
        ></video>
      </div>
      <h1 class="banner-title">
        找工作 上Hunt直聘
        <div class="subTitle">JOB HUNT</div>
      </h1>
      <div class="search">
        <Inputsearch
          @search="searchJobs"
          placeholder="输入城市或职位进行搜索"
        ></Inputsearch>
      </div>
      <div class="bottom-tips">
        <span class="arrow-down" @click="scrollDown">
          <i>⤓</i>
        </span>
        <span class="vertical-dashed"></span>
      </div>
    </div>

    <div class="main">
      <!-- 职位 -->
      <div class="job-category content-item-block">
        <h2 class="job-category-title title">探索你感兴趣的职位</h2>
        <ul class="job-category-list clearfix">
          <li
            v-for="item in jobCategories"
            :key="item.id"
            class="job-category-item"
          >
            <router-link
              :to="{ name: 'Jobs', params: { job_category_id: item.id } }"
            >
              <div class="image" :style="`backgroundImage:url(${item.image})`">
                <span class="overlay" v-if="!item.id">{{ item.zh_name }}</span>
              </div>
              <div v-if="item.id" class="name">{{ item.zh_name }}</div>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sStandard content-item-block">
        <h1 class="title">工作精神</h1>
        <div class="desc">
          当一个人喜爱他的工作时，你可以一眼看出来。他非常投入，他表现出来的自发性、创造性、专注和谨慎，十分明显。而这在那些视工作为应付差事、乏味无聊的人那里，是根本看不见的。
        </div>
        <div class="content">
          <div class="image">
            <span
              v-show="productLayerVisible"
              class="layer"
              @animationend="onScrollRightAnimationEnd"
            ></span>
            <img
              v-if="standards[standardActiveIndex]"
              width="100%"
              height="100%"
              :src="standards[standardActiveIndex].image"
              alt
            />
          </div>
          <div class="indicator">
            <ul>
              <li
                class="indicator-item"
                v-for="(item, index) in standards"
                :key="index"
              >
                <h3
                  :class="{ active: standardActiveIndex === index }"
                  @click="
                    () => {
                      standardActiveIndex = index;
                      productLayerVisible = true;
                    }
                  "
                >
                  {{ item.title }}
                </h3>
                <p
                  v-html="item.content"
                  v-show="standardActiveIndex === index"
                ></p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="workLife content-item-block">
        <h1 class="workLife-title">工作生活</h1>
        <div class="block-item block-item-one">
          <div class="block-item-column block-item-column-text">
            <h2 class="block-item-column-title">
              做喜欢的工作就是很好的创业
            </h2>
            <div class="content">
              <div class="content-item">
                <h2 class="content-item-title">有独立思考能力</h2>
                <p class="content-item-desc">
                  有独立思考能力，员工的激励效果才可预期，可预期的员工才能被管理。
                  表现出来的样子就是 行为有规律
                </p>
              </div>
              <div class="content-item">
                <h2 class="content-item-title">有逻辑能力</h2>
                <p class="content-item-desc">
                  对于任何事或者任何人，先了解，再理解, 然后再试图影响和改变。
                </p>
              </div>
              <div class="content-item">
                <h2 class="content-item-title">有成本概念</h2>
                <p class="content-item-desc">
                  任何时候谈需求的时候，都能先想到我准备为这个需求付出什么代价
                </p>
              </div>
            </div>
          </div>
          <div class="block-item-column block-item-column-image">
            <img
              src="https://i.hexuexiao.cn/up/9a/96/25/c03c77c9ae1dbf6bb3e5a3155325969a.jpg"
              alt
            />
          </div>
        </div>

        <div class="block-item block-item-one">
          <div class="block-item-column block-item-column-text">
            <h2 class="block-item-column-title">
              做喜欢的工作就是很好的创业
            </h2>
            <div class="content">
              <div class="content-item">
                <h2 class="content-item-title">有独立思考能力</h2>
                <p class="content-item-desc">
                  有独立思考能力，员工的激励效果才可预期，可预期的员工才能被管理。
                  表现出来的样子就是 行为有规律
                </p>
              </div>
              <div class="content-item">
                <h2 class="content-item-title">有逻辑能力</h2>
                <p class="content-item-desc">
                  对于任何事或者任何人，先了解，再理解, 然后再试图影响和改变。
                </p>
              </div>
              <div class="content-item">
                <h2 class="content-item-title">有成本概念</h2>
                <p class="content-item-desc">
                  任何时候谈需求的时候，都能先想到我准备为这个需求付出什么代价
                </p>
              </div>
            </div>
          </div>
          <div class="block-item-column block-item-column-image">
            <img
              src="https://sf3-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/life_1.png"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watchScrollDirection } from "@/helper/utilities.js";
import Inputsearch from "@/components/inputsearch.vue";
export default {
  name: "home",
  data() {
    return {
      productLayerVisible: true,
      search: "",
      jobCategories: [
        {
          id: "1",
          en_name: "developer",
          zh_name: "研发",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/rd2.png"
        },
        {
          id: "2",
          en_name: "teacher",
          zh_name: "教师",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/prod2.png"
        },
        {
          id: "3",
          en_name: "operator",
          zh_name: "运营",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/market2.png"
        },
        {
          id: "4",
          en_name: "designer",
          zh_name: "设计",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/design2.png"
        },
        {
          id: "5",
          en_name: "marketer",
          zh_name: "市场",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/market2.png"
        },
        {
          id: "6",
          en_name: "worker",
          zh_name: "工人",
          image:
            "https://ts1.cn.mm.bing.net/th/id/R-C.0dbfccd890d841c603acddb916e7b330?rik=%2bfiwD6bay2SxKg&riu=http%3a%2f%2fpic.ntimg.cn%2ffile%2f20160802%2f5757663_105230358000_2.jpg&ehk=tL%2bxypJn7t%2f4sWxemwVwh81c%2bLTPPz6IrPWLenPe4m0%3d&risl=&pid=ImgRaw&r=0"
        },
        {
          id: "7",
          en_name: "teacher",
          zh_name: "教师",
          image:
            "https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/jobslight/prod2.png"
        },
        {
          id: "",
          en_name: "whole",
          zh_name: "全部",
          image: ""
        }
      ],
      standards: [
        {
          title: "务实敢为",
          content:
            "直接体验，深入事实<br>不自嗨，注重效果，能突破有担当，打破定式<br>尝试多种可能，快速迭代",
          image:
            "https://img.51miz.com/preview/photo/00/01/50/28/P-1502806-FFDDD9BF.jpg"
        },
        {
          title: "开放谦逊",
          content:
            "内心阳光，信任伙伴<br>乐于助人和求助，合作成大事<br>格局大，上个台阶想问题<br>对外敏锐谦虚，ego 小，听得进意见",
          image:
            "https://img.51miz.com/preview/photo/00/01/50/24/P-1502491-7009E4D2.jpg"
        },
        {
          title: "追求极致",
          content:
            "不断提高要求，延迟满足感<br>在更大范围里找最优解，不放过问题，思考本质<br>持续学习和成长",
          image:
            "https://img.51miz.com/preview/photo/00/01/50/28/P-1502804-E3066048.jpg"
        },
        {
          title: "坦诚清晰",
          content:
            "敢当面表达真实想法<br>能承认错误，不装不爱面子<br>实事求是，暴露问题，反对“向上管理”<br>准确、简洁、直接，有条理有重点",
          image:
            "https://sf3-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/story/tancheng.png"
        },
        {
          title: "精益求精",
          content:
            "一个人无论从事何种职业，都应该尽职尽责，尽自己的最大努力，求得不断的进步<br>没有最好，只有更好<br>这不仅是工作的原则，也是人生的原则<br>在企业生产中，和精益求精背道而驰的，也是最不能令人容忍的现象就是粗制滥造。",
          image:
            "https://sf3-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/style03_1576395987141.png"
        },
        {
          title: "知恩图报",
          content:
            "知恩感恩既是中华民族的传统美德，也是做人做事的基本原则<br>知恩图报的人，会得到更多人的理解和支持<br>而以怨报德的人最终成为无人理睬的孤家寡人，甚至会成为《农夫和蛇》中的毒蛇，受到万人痛恨。",
          image: "https://pic.ntimg.cn/file/20160627/8572479_094211018000_2.jpg"
        }
      ],
      standardActiveIndex: 0
    };
  },
  created() {
    // localStorage.setItem("isLogin", false);
  },
  methods: {
    onScrollRightAnimationEnd() {
      this.productLayerVisible = false;
    },
    scrollDown() {
      this.$refs.product.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    searchJobs(keyword) {
      this.$router.push({ name: "Jobs", params: { keyword } });
    }
  },
  mounted() {
    const rootVm = this.$root;
    rootVm.$emit(
      "home-scrolling",
      { directionX: 1, directionY: -1 },
      { x: document.body.scrollLeft, y: document.body.scrollTop }
    );
    this.unwatch = watchScrollDirection(window, function(...args) {
      rootVm.$emit("home-scrolling", ...args);
    });
  },
  destroyed() {
    this.unwatch();
  },
  components: {
    Inputsearch
  }
};
</script>
<style lang="less" scoped>
@keyframes verticalMotion {
  0% {
    transform: translateY(6px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(6px);
  }
}
@keyframes scrollToRight {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.home {
  .main {
    width: @main-width;
    margin: auto;
  }
  .content-item-block {
    .title {
      font-size: @font-size-larger;
    }
  }
}

.banner {
  height: 100vh;
  min-height: 400px;
  min-width: @main-width;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(51, 112, 255, 0.2);
  position: relative;
  .video-wrapper {
    font-size: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    overflow: hidden;
    .video {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  &-title {
    color: #fff;
    font-size: 60px;
    text-align: center;
    .subTitle {
      &::after,
      &::before {
        content: "";
        position: absolute;
        background-image: linear-gradient(
          270deg,
          hsla(0, 0%, 100%, 0),
          #fff 47%,
          hsla(0, 0%, 100%, 0)
        );
        height: 2px;
        width: 89px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:before {
        right: 10px;
      }
      &:after {
        left: 10px;
      }
      position: relative;
      margin-top: 10px;
      font-size: @font-size-base;
      letter-spacing: 20px;
    }
  }
  .search {
    width: 500px;
    margin-top: 100px;
    margin-bottom: 40px;
  }
  .bottom-tips {
    position: absolute;
    bottom: 30px;
    width: 50px;
    height: 50px;
    flex-shrink: 0;

    text-align: center;
    .arrow-down {
      display: block;
      margin-bottom: 4px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #fff;
      text-align: center;
      line-height: 40px;
      color: #fff;
      cursor: pointer;
      font-size: 21px;
      i {
        animation: verticalMotion 1.3s infinite linear;
        display: inline-block;
        font-style: normal;
      }
    }
    // 分割竖线
    .vertical-dashed {
      border-left: 1px dashed #fff;
      height: 30px;

      display: inline-block;
    }
  }
}

// 产品
.product {
  margin-top: 40px;
  text-align: center;
  padding: 40px 40px;
  background: url(//sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/global.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0 370px;
  .desc {
    margin: 40px 0;
  }
  &-list {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  &-item {
    width: 90px;
    // height: 90px;
    cursor: pointer;
    &:nth-child(1),
    &:nth-child(9) {
      margin-top: 116px;
    }
    &:nth-child(2),
    &:nth-child(8) {
      margin-top: 80px;
    }
    &:nth-child(3),
    &:nth-child(7) {
      margin-top: 55px;
    }
    &:nth-child(4),
    &:nth-child(6) {
      margin-top: 30px;
    }
    &:hover {
      color: @main-color;
      img {
        border-radius: 19px;

        transform: scale(1.2);
        transform-origin: bottom;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
    }
    img {
      width: 90px;
      height: 90px;
      border-radius: 19px;

      margin-bottom: 10px;
      transition: transform 0.3s;
    }
  }
  .more {
    margin: auto;
    margin-top: 170px;

    width: 149px;
  }
}

// 职位

.job-category {
  text-align: center;
  margin-top: 90px;

  &-list {
    margin-top: 70px;
  }
  &-item {
    float: left;
    margin-bottom: 16px;
    .image {
      width: 250px;
      height: 250px;
      line-height: 250px;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 50%;
      margin: 0 auto;

      transition: all 0.3s;
      background-position: center;
      overflow: hidden;
      &:hover {
        box-shadow: 0 0 8px 1px #ccc;
        background-size: 110%;
        & + .name {
          color: @main-color;
        }
      }
      .overlay {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;

        font-size: 40px;
      }
    }
    .name {
      margin-top: 23px;
      font-size: @font-size-large;
    }
    margin: 0 2.5%;
    margin-bottom: 30px;
    width: 20%;
  }
}

// 字节范

.sStandard {
  padding: 40px 40px;
  overflow: hidden;
  .title {
    margin-bottom: 30px;
  }
  .desc {
    margin-bottom: 40px;
  }
  .content {
    .image {
      .layer {
        // left: -100%;
        width: 100%;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        animation: scrollToRight 0.8s ease-in-out;
      }

      position: relative;

      float: left;
      width: 700px;
      height: 450px;
      margin-right: 100px;
      overflow: hidden;
      img {
        border-radius: 6px;
        object-fit: cover;
      }
    }
  }
  .indicator {
    color: #aaa;

    &-item {
      margin: 32px 0;
      h3 {
        &.active {
          color: black;
          font-size: 32px;
          font-weight: 400;
        }
        cursor: pointer;
      }
    }
  }
}
// 字节生活
.workLife {
  // width:1200px;
  // overflow: hidden;
  &-title {
    margin-bottom: 70px;
  }
  padding-left: 10%;
  .block-item {
    overflow: hidden;
    margin-bottom: 100px;
    &:nth-child(odd) {
      .block-item-column {
        &-text {
          margin-right: 9%;
        }
        float: left;
      }
    }
    &:nth-child(even) {
      .block-item-column {
        &-image {
          margin-right: 9%;
        }
        float: right;
      }
    }

    &-column {
      &-title {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #ccc;
      }
      &-text {
        width: 30%;
      }
      &-image {
        height: 400px;
        width: 59%;
        border-radius: 8px;
        overflow: hidden;
        img {
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
