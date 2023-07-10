<template>
  <div class="progressquery">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="求职进度" name="first" class="hunt">
        <el-table
          ref="multipleTable"
          border
          stripe
          :data="tableDataHunt"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange1"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="company" label="公司" width="220">
          </el-table-column>
          <el-table-column prop="type" label="工作名称" width="200">
          </el-table-column>
          <el-table-column prop="salary" label="薪水" width="100">
          </el-table-column>
          <el-table-column
            prop="location"
            label="工作地址"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="status1" label="进度" width="80">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="提交时间"
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="150">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                size="medium"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >取消求职</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div v-show="!loading" class="pagination-wrapper">
          <Pagination
            :current-page.sync="currentPage1"
            :total="huntCount"
          ></Pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="招工进度" name="second" class="recruit">
        <el-table
          ref="multipleTable"
          border
          stripe
          :data="tableDataRecruit"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange2"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column fixed prop="company" label="公司" width="220">
          </el-table-column>
          <el-table-column prop="type" label="工作名称" width="200">
          </el-table-column>
          <el-table-column prop="salary" label="薪水" width="140">
          </el-table-column>
          <el-table-column
            prop="location"
            label="工作地址"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="提交时间"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column prop="surplusNumber" label="进度" width="200">
            <template slot-scope="props">
              已收 {{ props.row.totalNumber - props.row.surplusNumber }} 人|共需
              {{ props.row.totalNumber }} 人
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="260">
            <template slot-scope="scope">
              <el-button
                size="medium"
                @click="handleEditRecruit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="medium"
                @click="handleRecruitDatail(scope.$index, scope.row)"
                >详情</el-button
              >
              <el-button
                size="medium"
                type="danger"
                @click="handleRecruitDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="投递人信息" :visible.sync="dialogTableVisible">
          <el-table :data="recruitPeopleData">
            <el-table-column
              property="name"
              label="姓名"
              width="150"
            ></el-table-column>
            <el-table-column
              property="createTime"
              label="日期"
              width="150"
            ></el-table-column>
            <el-table-column
              property="age"
              label="年龄"
              width="80"
            ></el-table-column>
            <el-table-column
              property="sex"
              label="性别"
              width="80"
            ></el-table-column>
            <el-table-column
              property="phoneNumber"
              label="联系电话"
              width="150"
            ></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="success"
                  @click="handleSuccess(scope.$index, scope.row)"
                  >通过</el-button
                >
                <el-button
                  size="medium"
                  type="danger"
                  @click="handleFail(scope.$index, scope.row)"
                  >不通过</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog
          title="招工信息"
          :visible.sync="dialogFormVisible"
          width="800px"
        >
          <el-form :model="editRecruitForm">
            <el-form-item
              label="基本信息"
              :label-width="formTotalLabelWidth"
              class="basicImformation"
            >
              <i class="el-icon-edit"></i>
            </el-form-item>
            <el-form-item label="工作名称：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.type"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="工作地址：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.location"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.company"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="咨询电话：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.phoneNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="工作信息"
              :label-width="formTotalLabelWidth"
              class="basicImformation"
            >
              <i class="el-icon-edit"></i>
            </el-form-item>
            <el-form-item label="开始工作时间：" :label-width="formLabelWidth">
              <el-col :span="11">
                <el-date-picker
                  type="datetime"
                  placeholder="选择日期"
                  v-model="editRecruitForm.startDate"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="工作时间段：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.workPeriod"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="薪资：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.salary"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="工作待遇：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.foodAndRest"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="总职位数：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.totalNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="剩余职位数：" :label-width="formLabelWidth">
              <el-input
                v-model="editRecruitForm.surplusNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="工作内容描述：" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="6"
                v-model="editRecruitForm.details"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditRecruit()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/pagination.vue";
export default {
  name: "Progressquery",
  data() {
    return {
      activeName: "first",
      dialogTableVisible: false,
      dialogFormVisible: false,
      currentPage1: 1,
      currentPage2: 1,
      status1: 2,
      loading: false,
      tableDataHunt: [],
      huntCount: 0,
      recruitCount: 0,
      tableDataRecruit: [],
      recruitPeopleData: [],
      editRecruitForm: {
        type: "",
        location: "",
        workPeriod: "",
        foodAndRest: "",
        salary: "",
        totalNumber: 0,
        surplusNumber: 0,
        company: "",
        companyId: "",
        recruitmentId: 0,
        details: [],
        phoneNumber: "",
        logoUrl: "",
        descriptionUrls: [],
        startDate: ""
      },
      multipleSelection1: [],
      multipleSelection2: [],
      formLabelWidth: "150px",
      formTotalLabelWidth: "70px"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      if (this.activeName == "first") {
        this.fetchHuntStatus();
      } else {
        this.fetchRecruitStatus();
      }
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    async fetchHuntStatus() {
      this.tableDataHunt.splice(0);
      const loading = this.$loading();
      const url = `http://8.130.44.99:9001/hunting/employee/${this.currentPage1}/${localStorage.getItem("loginId")}/${this.status1}`;
      await request
        .get(url)
        .then(res => {
          if (res.data.code === 200) {
            loading.close();
            this.huntcount = res.data.data.huntings.length;
            var ss = "";
            if (this.status1 == 1) {
              ss = "通过";
            } else if (this.status1 == 2) {
              ss = "未审核";
            } else {
              ss = "未通过";
            }
            for (var i = 0; i < this.huntcount; i++) {
              this.tableDataHunt.push(res.data.data.huntings[i].recruitment);
              var num = this.tableDataHunt[i].createTime.indexOf("T");
              this.tableDataHunt[i].createTime = this.tableDataHunt[i].createTime.slice(0, num)
            }
            this.tableDataHunt.forEach(item => {
              item.status1 = ss;
              item.hunterId = "";
              item.huntingId = "";
              item.name = "";
            });
            for (var j = 0; j < this.huntcount; j++) {
              this.tableDataHunt[j].hunterId =
                res.data.data.huntings[j].hunting.hunterId;
              this.tableDataHunt[j].huntingId =
                res.data.data.huntings[j].hunting.huntingId;
              this.tableDataHunt[j].name =
                res.data.data.huntings[j].hunting.name;
            }
            this.$message({
              message: "获取列表成功",
              type: "success"
            });
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
    async fetchRecruitStatus() {
      this.tableDataHunt.splice(0);
      const loading = this.$loading();
      const url = `http://8.130.44.99:9001/recruitment/${this.currentPage2}/${localStorage.getItem("loginId")}`;
      await request
        .get(url)
        .then(res => {
          if (res.data.code === 200) {
            this.recruitCount = res.data.data.recruitments.length;
            this.tableDataRecruit = res.data.data.recruitments;
            for (var i = 0; i < this.recruitCount; i++) {
              var num = this.tableDataRecruit[i].createTime.indexOf("T");
              this.tableDataRecruit[i].createTime = this.tableDataRecruit[i].createTime.slice(0, num)
            }
            loading.close();
            this.$message({
              message: "获取列表成功",
              type: "success"
            });
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
    async handleDelete(index, row) {
      this.$confirm("此操作将永久取消求职, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const loading = this.$loading();
          const url = "http://8.130.44.99:9001/hunting";
          var param = {
            type: 1,
            huntingId: row.huntingId
          };
          await request
            .delete(url, { data: param })
            .then(res => {
              if (res.data.code === 200) {
                loading.close();
                this.$message({
                  message: "取消求职成功",
                  type: "success"
                });
                this.tableDataHunt.splice(index, 1);
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
                message: "取消求职失败 " + err,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEditRecruit(index, row) {
      this.dialogFormVisible = true;
      this.editRecruitForm = row;
      this.editRecruitForm.startDate = "2023-01-01";
    },
    async EditRecruit() {
      var formDate = new FormData();
      formDate.append("recruitmentId", this.editRecruitForm.recruitmentId);
      formDate.append("type", this.editRecruitForm.type);
      formDate.append("logoUrl", this.editRecruitForm.logoUrl);
      formDate.append("location", this.editRecruitForm.location);
      formDate.append("workPeriod", this.editRecruitForm.workPeriod);
      formDate.append("foodAndRest", this.editRecruitForm.foodAndRest);
      formDate.append("salary", this.editRecruitForm.salary);
      formDate.append("startDate", this.editRecruitForm.startDate);
      formDate.append("descriptionUrls", this.editRecruitForm.descriptionUrls);
      formDate.append("details", this.editRecruitForm.details);
      formDate.append("totalNumber", this.editRecruitForm.totalNumber);
      formDate.append("surplusNumber", this.editRecruitForm.surplusNumber);
      formDate.append("company", this.editRecruitForm.company);
      formDate.append("companyId", this.editRecruitForm.companyId);
      formDate.append("phoneNumber", this.editRecruitForm.phoneNumber);
      const url = "http://8.130.44.99:9001/recruitment";
      await request
        .put(url, formDate)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "修改失败 " + err,
            type: "error"
          });
        });
    },
    async handleRecruitDatail(index, row) {
      this.recruitPeopleData.splice(0);
      const loading = this.$loading();
      const url = `http://8.130.44.99:9001/hunting/employer/${this.currentPage2}/${row.recruitmentId}`;
      await request
        .get(url)
        .then(res => {
          if (res.data.code === 200) {
            this.recruitPeopleData = res.data.data.huntings;
            for (var i = 0; i < this.recruitPeopleData.length; i++) {
              var num = this.recruitPeopleData[i].createTime.indexOf("T");
              this.recruitPeopleData[i].createTime = this.recruitPeopleData[i].createTime.slice(0, num)
              if (this.recruitPeopleData[i].sex == 1) {
                this.recruitPeopleData[i].sex = "男";
              } else {
                this.recruitPeopleData[i].sex = "女";
              }
            }
            var len = this.recruitPeopleData.length;
            for (var j = 0; j < len; j++) {
              if (this.recruitPeopleData[j].status == 3) {
                this.recruitPeopleData.splice(j, 1);
                len = this.recruitPeopleData.length;
              }
            }
            loading.close();
            this.$message({
              message: "获取详细信息成功",
              type: "success"
            });
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
            message: "获取详细信息失败 " + err,
            type: "error"
          });
        });
      this.dialogTableVisible = true;
    },
    async handleSuccess(index, row) {
      const url = "http://8.130.44.99:9001/hunting/handle";
      await request
        .put(url, {
          result: 1,
          huntingId: row.huntingId
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "通过成功",
              type: "success"
            });
            this.recruitPeopleData.splice(index, 1);
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "通过失败 " + err,
            type: "error"
          });
        });
      this.fetchRecruitStatus();
    },
    async handleFail(index, row) {
      const url = "http://8.130.44.99:9001/hunting/handle";
      await request
        .put(url, {
          result: 0,
          huntingId: row.huntingId
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: "不通过成功",
              type: "success"
            });
            this.recruitPeopleData.splice(index, 1);
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "不通过失败 " + err,
            type: "error"
          });
        });
    },
    async handleRecruitDelete(index, row) {
      // var formDate = new FormData();
      // formDate.append("profession", this.job_category_id_list);
      // formDate.append("workPlace", this.location_code_list);
      // formDate.append("salary", 0);
      this.$confirm("此操作将永久取消求职, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const url = "http://8.130.44.99:9001/recruitment";
          var data = {
            type: 1,
            recruitmentId: row.recruitmentId
          };
          const loading = this.$loading();
          await request
            .delete(url, { data })
            .then(res => {
              if (res.data.code === 200) {
                loading.close();
                this.$message({
                  message: "删除招工成功",
                  type: "success"
                });
                this.tableDataRecruit.splice(index, 1);
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
                message: "删除招工失败 " + err,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    if (this.activeName == "first") {
      this.fetchHuntStatus();
    } else {
      this.fetchRecruitStatus();
    }
  },
  components: {
    Pagination
  }
};
</script>
<style scoped>
.progressquery {
  width: 1400px;
  margin: auto;
  margin-top: 80px;
  margin-bottom: 120px;
  border: 5px solid #ccc;
  padding: 20px;
  border-radius: 15px;
  line-height: 2em;
}
.hunt {
  font-size: larger !important;
}
::v-deep .el-tabs__item {
  font-size: large;
}
::v-deep .cell {
  font-size: 18px;
  text-align: center;
}
::v-deep .el-tabs__active-bar {
  width: 75px;
}
.footer {
  margin-top: 50px !important;
}
::v-deep .el-dialog {
  width: 75%;
}
::v-deep .el-form-item__label {
  font-size: 16px !important;
}
::v-deep .basicImformation .el-form-item__label {
  padding-right: 0 !important;
  text-align: left;
}
</style>
